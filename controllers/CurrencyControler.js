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
      return '```' + `TC hoy ${fecha}: Compra = ${compra} - Venta = ${venta}, EUR = ${EUR_exchange}!` + '```' 
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
        return this.getExhangeRate(COIN, data_cached.exchanges)
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
        return  this.getExhangeRate(COIN, newExchange.exchanges)
      }
    } catch (error) {
      console.log('error', error)

      return 'zzz - tipo de cambio murio'
    }
  }


  async getCurrentExchangeOthers(COIN) {
    try {
      // first check if data in DB 
      const day = dayjs().utc().hour(0).minute(0).second(0).millisecond(0)
      const data_cached = await ExhangeModel.findOne({
        srcData: 'API',
        createdAt: new Date(day)
      })
      
      if(data_cached?.createdAt){
        console.log('1')
        const exchangeRateLabel = this.getExhangeRate(COIN, data_cached.exchanges)

        return  '```' + `TC hoy ${day.format('YYYY-MM-DD')} de PEN a ${COIN}: ${exchangeRateLabel} !` + '```'
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
        const exchangeRateLabel = this.getExhangeRate(COIN, newExchange.exchanges)
        
        return '```' + `TC hoy ${day.format('YYYY-MM-DD')} de PEN a ${COIN}: ${exchangeRateLabel} !` + '```'
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
      const rateToPEN = exchanges.find((val)=>val.label == 'PEN') // usd to PEN
      const rateToOther = exchanges.find((val)=>val.label == COIN) // usd to ARF

      if (!rateToPEN?.rate || !rateToOther?.rate) throw Error

      return (rateToPEN.rate/rateToOther.rate).toFixed(2)
      
    } catch (error) {
      console.log('error', error)

      return 'zzz - tipo de cambio murio'
    }
  }

}

export default new CurrencyController()