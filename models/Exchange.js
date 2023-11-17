import { Schema } from 'mongoose'
import { dbBot } from '../connections/index.js'


const CurrencyRateSchema = new Schema({
  label: {
    type     : String,
    required : true
  },
  rate : {
    type     : Number,
    required : true
  }
}, { timestamps: true })


const ExchangeSchema = new Schema({
  srcLabel: {
    type     : String,
    required : true
  },
  srcData: {
    type     : String,
    required : true
  },
  createdAt: Date,
  exchanges: [ CurrencyRateSchema ]
}, { timestamps: true })

const ExhangeModel = dbBot.model('Exchange', ExchangeSchema)

export default ExhangeModel
