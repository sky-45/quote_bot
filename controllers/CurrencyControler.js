import axios from 'axios';
import { Error } from 'mongoose';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'



dayjs.extend(utc)

import ExhangeModel from '../models/Exchange.js'


const {URL_CURRENCY_SUNAT_API = 'https://api.apis.net.pe/v1/tipo-cambio-sunat'} = process.env
const {URL_CURRENCY_OTHERS_API = 'https://v6.exchangerate-api.com/v6/7d4038e00aefa1ccd69b614c/latest/USD'} = process.env

class CurrencyController {
  async getCurrentExchangeUSD() {
    try {
      const { data: {compra, venta, fecha} } = await axios.get(`${URL_CURRENCY_SUNAT_API}`, {})
      const EUR_exchange = await this.getExchangeEUR()
      return '```' + `TC SBS hoy ${fecha}: Compra = ${compra} - Venta = ${venta}, EUR = ${EUR_exchange}!` + '```' 
    } catch (error) {
      console.log('error', error)

      return 'zzz - tipo de cambio murio'
    }
  }

  async getExchangeEUR() {
    try {
      const COIN = 'EUR'
      const day = dayjs().utc().hour(0).minute(0).second(0).millisecond(0)
      const data_cached = await ExhangeModel.findOne({
        srcData: 'API',
        createdAt: new Date(day)
      })

      if(data_cached?.createdAt) {
        return this.getExhangeRate(COIN, data_cached.exchanges)[0]
      }
      else {
        const { data: {result,base_code,conversion_rates={}} } = await axios.get(`${URL_CURRENCY_OTHERS_API}`, { 
          headers: { 
            "Accept": "text/plain",
            "Accept-Encoding": "gzip,deflate,compress"
          }
        })
        if(result != 'success') throw Error      
        // first format data from API
        const cleaned_data = this.formatExchangeObj(conversion_rates) 
        // store cleaned data
        let newExchange = {
          srcData  : 'API',
          srcLabel  : base_code,
          exchanges: cleaned_data,
          createdAt: new Date(day)
        }
        newExchange = await ExhangeModel.create(newExchange)
        return  this.getExhangeRate(COIN, newExchange.exchanges)[0]
      }
    } catch (error) {
      console.log('error', error)

      return 'zzz - tipo de cambio murio'
    }
  }


  async getCurrentExchangeOthers(COIN) {
    try {
      if(!valid_coins.includes(COIN)) return '```' + 'Moneda no soportada!' + '```'
      // first check if data in DB 
      const day = dayjs().utc().hour(0).minute(0).second(0).millisecond(0)
      const data_cached = await ExhangeModel.findOne({
        srcData: 'API',
        createdAt: new Date(day)
      })
      
      if(data_cached?.createdAt){
        console.log('1')
        const [exchangeRateLabel_1,exchangeRateLabel_2] = this.getExhangeRate(COIN, data_cached.exchanges)

        return  '```' + `TC hoy ${day.format('YYYY-MM-DD')} de ${COIN} a PEN: ${exchangeRateLabel_1}, PEN a ${COIN}: ${exchangeRateLabel_2}!` + '```'
      }
      else {
        console.log('2')
        // if data not in DB get from API
        const { data: {result,base_code,conversion_rates={}} } = await axios.get(`${URL_CURRENCY_OTHERS_API}`, { 
          headers: { 
            "Accept": "text/plain",
            "Accept-Encoding": "gzip,deflate,compress"
          }
        })
        if(result != 'success') throw Error      

        // first format data from API
        const cleaned_data = this.formatExchangeObj(conversion_rates) 
        // store cleaned data
        let newExchange = {
          srcData  : 'API',
          srcLabel  : base_code,
          exchanges: cleaned_data,
          createdAt: new Date(day)
        }
        newExchange = await ExhangeModel.create(newExchange)
        // get data from Object document
        const [exchangeRateLabel_1,exchangeRateLabel_2] = this.getExhangeRate(COIN, data_cached.exchanges)
        
        return  '```' + `TC hoy ${day.format('YYYY-MM-DD')} de ${COIN} a PEN: ${exchangeRateLabel_1}, PEN a ${COIN}: ${exchangeRateLabel_2}!` + '```'
      }
    } catch (error) {
      console.log('error', error)

      return 'zzz - tipo de cambio murio'
    }
  }

  formatExchangeObj(conversion_rates={}){
    try {
      const cleanedData = []
      for (let key in conversion_rates) {
        cleanedData.push({
          label: key,
          rate: conversion_rates[key]
        })
      }

      return cleanedData
    } catch (error) {
      console.log('error', error)

      return 'zzz - tipo de cambio murio'
    }
  }

  getExhangeRate(COIN, exchanges){
    try {
      console.log(COIN)
      const rateToPEN = exchanges.find((val)=>val.label == 'PEN') // usd to PEN
      const rateToOther = exchanges.find((val)=>val.label == COIN) // usd to ARF

      console.log(rateToPEN, rateToOther)

      if (!rateToPEN?.rate || !rateToOther?.rate) throw Error

      return [(rateToPEN.rate/rateToOther.rate).toFixed(3), (rateToOther.rate/rateToPEN.rate).toFixed(3)]
      
    } catch (error) {
      console.log('error', error)

      return 'zzz - tipo de cambio murio'
    }
  }

}


const valid_coins = [
  "PEN",
  "AED",
  "AFN",
  "ALL",
  "AMD",
  "ANG",
  "AOA",
  "ARS",
  "AUD",
  "AWG",
  "AZN",
  "BAM",
  "BBD",
  "BDT",
  "BGN",
  "BHD",
  "BIF",
  "BMD",
  "BND",
  "BOB",
  "BRL",
  "BSD",
  "BTN",
  "BWP",
  "BYN",
  "BZD",
  "CAD",
  "CDF",
  "CHF",
  "CLP",
  "CNY",
  "COP",
  "CRC",
  "CUP",
  "CVE",
  "CZK",
  "DJF",
  "DKK",
  "DOP",
  "DZD",
  "EGP",
  "ERN",
  "ETB",
  "EUR",
  "FJD",
  "FKP",
  "FOK",
  "GBP",
  "GEL",
  "GGP",
  "GHS",
  "GIP",
  "GMD",
  "GNF",
  "GTQ",
  "GYD",
  "HKD",
  "HNL",
  "HRK",
  "HTG",
  "HUF",
  "IDR",
  "ILS",
  "IMP",
  "INR",
  "IQD",
  "IRR",
  "ISK",
  "JEP",
  "JMD",
  "JOD",
  "JPY",
  "KES",
  "KGS",
  "KHR",
  "KID",
  "KMF",
  "KRW",
  "KWD",
  "KYD",
  "KZT",
  "LAK",
  "LBP",
  "LKR",
  "LRD",
  "LSL",
  "LYD",
  "MAD",
  "MDL",
  "MGA",
  "MKD",
  "MMK",
  "MNT",
  "MOP",
  "MRU",
  "MUR",
  "MVR",
  "MWK",
  "MXN",
  "MYR",
  "MZN",
  "NAD",
  "NGN",
  "NIO",
  "NOK",
  "NPR",
  "NZD",
  "OMR",
  "PAB",
  "PGK",
  "PHP",
  "PKR",
  "PLN",
  "PYG",
  "QAR",
  "RON",
  "RSD",
  "RUB",
  "RWF",
  "SAR",
  "SBD",
  "SCR",
  "SDG",
  "SEK",
  "SGD",
  "SHP",
  "SLE",
  "SLL",
  "SOS",
  "SRD",
  "SSP",
  "STN",
  "SYP",
  "SZL",
  "THB",
  "TJS",
  "TMT",
  "TND",
  "TOP",
  "TRY",
  "TTD",
  "TVD",
  "TWD",
  "TZS",
  "UAH",
  "UGX",
  "USD",
  "UYU",
  "UZS",
  "VES",
  "VND",
  "VUV",
  "WST",
  "XAF",
  "XCD",
  "XDR",
  "XOF",
  "XPF",
  "YER",
  "ZAR",
  "ZMW",
  "ZWL"
]

export default new CurrencyController()