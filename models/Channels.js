import { Schema } from 'mongoose'
import { dbBot } from '../connections/index.js'

const ChannelSchema = new Schema({
  name : {
    type     : String,
    required : true
  },
  addedBy: {
    type     : String,
    required : true
  }
}, { timestamps: true })

const ChannelModel = dbBot.model('Channel', ChannelSchema)

export default ChannelModel
