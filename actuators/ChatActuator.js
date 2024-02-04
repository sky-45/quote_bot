import axios from 'axios';

const {URL_CHAT_API = 'ollama/api/generate'} = process.env

export const ChatActuator = async (msg)=> {
  try {
    const question = msg.content.trim().substring(10,msg.content.length) || ''

    const { data: joke } = await axios.post(URL_CHAT_API,
      `{\n  "model": "tinyllama",\n  "prompt": "${question}",\n  "stream": false\n}`,
      {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    await msg.channel.send('```' + joke.response + '```')

    
  } catch (error) {
    console.log(error)
    await msg.channel.send('``` Chatbot en mantenimiento :c ```')
  }
}