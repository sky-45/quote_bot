import { Schema } from 'mongoose'
import { dbBot } from '../connections/index.js'

const MovieSchema = new Schema({
  title: {
    type     : String,
    required : true
  },
  number : {
    type     : Number,
    required : true
  },
  status: {
    type     : String,
    required : true,
    enum: ['watched', 'watching', 'toWatch'],
    default: 'toWatch'
  },
  addedBy: {
    type     : String,
    required : true
  }
}, { timestamps: true })

const MovieModel = dbBot.model('Movie', MovieSchema)

export default MovieModel
