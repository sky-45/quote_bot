
import ChatController from '../controllers/ChatController.js';

export const ChatActuator = async (msg)=> {
  try {
    // get current model to get data from 

    const question = msg.content.trim().substring(10,msg.content.length).trim() || ''

    msg.channel.sendTyping()

    const response = await ChatController.getChatbotAnswer(question)

    const discordChatResponse = await msg.reply({ content: '```' + response + '```', fetchReply: true })

    const userMessage = {
      message: question,
      messageID: msg.id
    }

    const chatbotMessage = {
      message: response,
      messageID: discordChatResponse.id
    }
    
    const newchat = await ChatController.addNewChat(msg.author.id,userMessage, chatbotMessage)

  } catch (error) {
    console.log(error)
    await msg.channel.send('``` No quiero :c ```')
  }
}

