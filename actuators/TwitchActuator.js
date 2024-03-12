import axios from 'axios';
import TwitchController from '../controllers/TwitchController.js'

export const TwitchActuator = async (msg)=> {
  try {
    if (msg.content.startsWith('!addStream ')) {
      const streamTitle = msg.content.substring('!addStream '.length);
      const successMessage = await TwitchController.addChannel(streamTitle, msg.author.username);
      msg.reply(successMessage)
    }
  

  } catch (error) {
    console.log(error)
  }
}