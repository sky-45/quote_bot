import mongoose from 'mongoose'

const url = process.env.MONGO_CONNECTION

const dbQuotes = mongoose.createConnection(url, {
  keepAlive         : true,
  socketTimeoutMS   : 0,
  useNewUrlParser   : true,
  useUnifiedTopology: true
})

dbQuotes.on('connected', function() {
  console.log('MongoDB connected!')
})

dbQuotes.once('open', function() {
  console.log('MongoDB connection opened!')
})

export {
  dbQuotes
}
