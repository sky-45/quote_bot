import { Schema } from 'mongoose'
import { dbBot } from '../connections/index.js'

const QuoteSchema = new Schema({
  quote: {
    type     : String,
    required : true
  },
  author: {
    type     : String
  }
}, { timestamps: true })

const QuoteModel = dbBot.model('Quote', QuoteSchema)

export default QuoteModel
