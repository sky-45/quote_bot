import ChatModel from '../models/Chat.js'
import lodash from 'lodash'
import axios from 'axios';
import { Error } from 'mongoose';
import RedisController from './RedisController.js';

// const {URL_CHAT_API = 'http://localhost:11434/api/generate'} = process.env
const {URL_CHAT_API = 'http://localhost:11434'} = process.env

class ChatController {
  async addNewChat(userId, userMessage, chatbotMessage) {
    try {
      const newChat = [
        {
          userMessage: userMessage.message,
          userMessageID: userMessage.messageID,
          chatbotMessage: chatbotMessage.message,
          chatbotMessageID: chatbotMessage.messageID
        }
      ]

      const chat = await ChatModel.create({
        userId,
        chats: newChat,
        lastChatbotMessageID: chatbotMessage.messageID
      })

      return chat
    } catch (error) {
      console.log('error creating chat thread', error)
    }
  }

  async getChatbotAnswer(question) {
    try {
      const model = await this.getChatbotModel()

      const { data: { response } } = await axios.post(`${URL_CHAT_API}/api/generate`,
        {
          model,
          prompt: question,
          stream: false
        }
      )

      return response
      
    } catch (error) {
      console.log('error getting getChatbotAnswer', error)
    }
  }

  async getChatbotModel() {
    try {
      let model = await RedisController.getRedis('currentModelLLM')

      if(!model) {
        model = 'llama3:8b'
        await RedisController.setRedis('currentModelLLM', model)
        
      }

      const currentModels = await this.listLocalModels()
      const isModelAvaliable = currentModels.find((el)=> el == model)

      if(!isModelAvaliable) {

        const statusPull = await this.pullModel(model)
        if(statusPull) return model

        throw new Error()
      }

      return model
    } catch (error) {
      console.log('error getting chatbot model')
    }
  }

  async listLocalModels() {
    try {

      const { data: { models=[] } } = await axios.get(`${URL_CHAT_API}/api/tags`)

      return models.map((el)=>{
        return el.model
      })
      
    } catch (error) {
      console.log('error getting local models', error)
    }
  }

  async pullModel(model) {
    try {

      const {data: {status}} = await axios.post(`${URL_CHAT_API}/api/pull`,{
        name: model,
        stream: false
      })

      return status == 'success'
      
    } catch (error) {
      console.log('error pulling models', model)
    }
  }

  async updateChatThread() {

  }
}

export default new ChatController()