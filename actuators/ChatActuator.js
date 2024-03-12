import axios from 'axios';
import RedisController from '../controllers/RedisController.js'


const {URL_CHAT_API = 'http://localhost:11434/api/generate'} = process.env

export const ChatActuator = async (msg)=> {
  try {
    // check if query is getting procesed 
    let checkRunning = await RedisController.getRedis('runningChatBot')

    if(checkRunning){
      await msg.channel.send('``` A message is being generated, please wait ```')
      return 
    } 

    await RedisController.setRedis('runningChatBot', 'arf', 60*2)

    // start procesing query
    
    const question = msg.content.trim().substring(10,msg.content.length) || ''
    msg.channel.sendTyping()
    const { data: joke } = await axios.post(URL_CHAT_API,
      `{\n  "model": "stablelm2",\n  "prompt": "${question}",\n  "stream": false\n}`,
      {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    await RedisController.deleteRedis('runningChatBot')
    // await msg.channel.send('```' + joke.response + '```')
    await msg.reply({ content: '```' + joke.response + '```', fetchReply: true })

    
  } catch (error) {
    console.log(error)
    await msg.channel.send('``` Chatbot en mantenimiento :c ```')
  }
}