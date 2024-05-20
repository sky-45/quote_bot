import { Schema } from 'mongoose'
import { dbBot } from '../connections/index.js'


const messageSchema = new Schema({
  userMessage: { type: String, required : true },
  userMessageID: { type: String, required : true },
  chatbotMessage: { type: String, required : true },
  chatbotMessageID: { type: String, required : true },
})  

const ChatSchema = new Schema({
  userId: { type: String, required : true },
  chats: [ messageSchema ],
  lastChatbotMessageID: { type: String, required : true }
}, { timestamps: true })

const ChatModel = dbBot.model('Chat', ChatSchema)

export default ChatModel
