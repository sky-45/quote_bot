import mongoose from 'mongoose'

const url = process.env.MONGO_CONNECTION

const dbBot = mongoose.createConnection(url, {
  keepAlive         : true,
  socketTimeoutMS   : 0,
  useNewUrlParser   : true,
  useUnifiedTopology: true
})

dbBot.on('connected', function() {
  console.log('MongoDB connected!')
})

dbBot.once('open', function() {
  console.log('MongoDB connection opened!')
})

export {
  dbBot
}
