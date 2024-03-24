import { Schema } from 'mongoose'
import { dbBot } from '../connections/index.js'

const PointsSchema = new Schema({
  userId: {
    type     : String,
    required : true,
  },
  points : {
    type     : Number,
    required : true,
    default  : 0
  }
}, { timestamps: true })

const PointsModel = dbBot.model('Points', PointsSchema)

export default PointsModel
