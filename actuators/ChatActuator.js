

import ChatController from '../controllers/ChatController.js';

export const ChatActuator = async (msg)=> {
  try {

    if(msg.content.startsWith('!monsebotUpgrade ')) {
      const new_bot = msg.content.trim().substring(16,msg.content.length).trim() || ''
      console.log('new_bot', new_bot)
      const new_model = await ChatController.getChatbotModel(new_bot)
      await msg.reply({ content: '```' +'New model updated: '+ + new_model + '```', fetchReply: true })
    }

    if(msg.content.startsWith('!monseimagen ')) {
      const question = msg.content.trim().substring(13,msg.content.length).trim() || ''
      if(!question) return 

      msg.channel.sendTyping()
      const response = await ChatController.getMultimodalImageAnswer(question)
    }
    // new message
    if(msg.content.startsWith('!monsebot ')) {
      const question = msg.content.trim().substring(10,msg.content.length).trim() || ''
      if(!question) return 

      msg.channel.sendTyping()
      const response = await ChatController.getChatbotAnswer(question)

      let discordChatResponse
      if(response.length <= 1900)
        discordChatResponse = await msg.reply({ content: '```' + response + '```', fetchReply: true })
      else {
        const rounds = Math.floor(response.length/1900)
        for(let i=0; i<=rounds; i++) {
          const text = response.substring(i*1900,(i+1)*1900)
          discordChatResponse = await msg.reply({ content: '```' + text + '```', fetchReply: true })
        }
      }

      // discordChatResponse = await msg.reply({ content: '```' + response + '```', fetchReply: true })

      const userMessage = {
        message: question,
        messageID: msg.id
      }
  
      const chatbotMessage = {
        message: response,
        messageID: discordChatResponse.id
      }
      
      const newchat = await ChatController.addNewChat(msg.author.id,userMessage, chatbotMessage)

    }
    else {
      const checkExistThread = await ChatController.validateMessageIsChat(msg)
      // old thread
      if(checkExistThread) {
        msg.channel.sendTyping()

        const response = await ChatController.getChatbotThreadAnswer(checkExistThread.chats, msg.content)

        let discordChatResponse
        if(response.length <= 1900)
          discordChatResponse = await msg.reply({ content: '```' + response + '```', fetchReply: true })
        else {
          const rounds = Math.floor(response.length/1900)
          for(let i=0; i<=rounds; i++) {
            const text = response.substring(i*1900,(i+1)*1900)
            discordChatResponse = await msg.reply({ content: '```' + text + '```', fetchReply: true })
          }
        }

        const userMessage = {
          message: msg.content,
          messageID: msg.id
        }
    
        const chatbotMessage = {
          message: response,
          messageID: discordChatResponse.id
        }
        
        const updatedChat = await ChatController.updateChatThread(checkExistThread, userMessage, chatbotMessage)
      }
    }




  } catch (error) {
    console.log(error)
    await msg.channel.send('``` No quiero :c ```')
  }
}

