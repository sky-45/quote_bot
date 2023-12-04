import { Schema } from 'mongoose'
import { dbBot } from '../connections/index.js'

const BirthdaySchema = new Schema({
  user: {
    type     : String,
    required : true
  },
  year : {
    type     : Number,
    required : true
  },
  month : {
    type     : Number,
    required : true
  },
  day : {
    type     : Number,
    required : true
  },
  addedBy: {
    type     : String,
    required : true
  }
}, { timestamps: true })

const BirthdayModel = dbBot.model('Birthday', BirthdaySchema)

export default BirthdayModel
