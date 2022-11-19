import { Schema } from 'mongoose'
import { dbQuotes } from '../connections/index.js'

const QuoteSchema = new Schema({
  quote: {
    type     : String,
    required : true
  },
  author: {
    type     : String
  }
}, { timestamps: true })

const QuoteModel = dbQuotes.model('Quote', QuoteSchema)

export default QuoteModel
