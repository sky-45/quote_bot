import ChatModel from '../models/Chat.js'
import lodash from 'lodash'
import axios from 'axios';
import { Error } from 'mongoose';
import RedisController from './RedisController.js';
import { getCurrentTime} from '../utils/index.js'


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
      console.log(`[${getCurrentTime()}] Error ChatController-addNewChat:`, error)
    }
  }

  async updateChatThread(thread, userMessage, chatbotMessage) {
    try {
      // find used thread 

      const newChat = [...thread.chats, {
        userMessage: userMessage.message,
        userMessageID: userMessage.messageID,
        chatbotMessage: chatbotMessage.message,
        chatbotMessageID: chatbotMessage.messageID
      }]

      const newThread = await ChatModel.findByIdAndUpdate(thread._id,
        { $set: {
          chats: newChat,
          lastChatbotMessageID: chatbotMessage.messageID
          }
        },
        { 'new': true }
      ).lean()

      return newThread
      
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error ChatController-updateChatThread:`, error)
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
      console.log(`[${getCurrentTime()}] Error ChatController-getChatbotAnswer:`, error)
    }
  }

  async getMultimodalImageAnswer(question) {
    try {
      const model = await this.getChatbotModel('llava:7b')

      const { data: { response } } = await axios.post(`${URL_CHAT_API}/api/generate`,
        {
          model,
          prompt: question,
          stream: false,
          options: {
            num_predict: 5
          }
        }
      )
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error ChatController-getMultimodalImageAnswer:`, error)
    }
  }

  async getChatbotThreadAnswer(threadChats, question) {
    try {
      const model = await this.getChatbotModel()

      const messages = this.formatThread(threadChats, question)

      const { data: { message: {content} } } = await axios.post(`${URL_CHAT_API}/api/chat`,
        {
          model,
          messages,
          stream: false
        }
      )

      return content
      
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error ChatController-getChatbotThreadAnswer:`, error)
    }
  }

  formatThread(thread = [], newQuestion) {
    try {

      const messages = []

      thread.forEach(({userMessage, chatbotMessage}) => {
        messages.push({
          role: 'user',
          content: userMessage
        },{
          role: 'assistant',
          content: chatbotMessage
        })
      })

      messages.push({
        role: 'user',
        content: newQuestion
      })
      
      return messages
      
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error ChatController-formatThread:`, error)
    }
  }

  async validateMessageIsChat(msg){
    try {

      const thread = await ChatModel.findOne({
        lastChatbotMessageID: msg.reference.messageId
      }).lean()

      return thread || undefined
      
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error ChatController-validateMessageIsChat:`, error)

    }
  }

  async getChatbotModel(newModel = undefined) {
    try {
      let model = newModel

      if(!model)
        model = await RedisController.getRedis('currentModelLLM')

      if(!model) {
        model = 'llama3:8b'
        await RedisController.setRedis('currentModelLLM', model)
        
      }

      const currentModels = await this.listLocalModels()
      const isModelAvaliable = currentModels.find((el)=> el == model)

      if(!isModelAvaliable) {

        const statusPull = await this.pullModel(model)
        if(statusPull) {
          await RedisController.setRedis('currentModelLLM', model)
          return model
        }

        throw new Error()
      }

      return model
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error ChatController-getChatbotModel:`, error)
    }
  }

  async listLocalModels() {
    try {

      const { data: { models=[] } } = await axios.get(`${URL_CHAT_API}/api/tags`)

      return models.map((el)=>{
        return el.model
      })
      
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error ChatController-listLocalModels:`, error)
    }
  }

  async pullModel(model) {
    try {

      const {data: {status}} = await axios.post(`${URL_CHAT_API}/api/pull`,{
        name: model,
        stream: false
      })


      return status == 'success' ? true : false
      
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error ChatController-pullModel:`, error)
    }
  }

}

export default new ChatController()