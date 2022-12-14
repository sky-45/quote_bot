import {Client, GatewayIntentBits, Events } from 'discord.js';

import QuoteController from './controllers/QuoteController.js';
import JokeController from './controllers/JokeController.js';


const client = new Client({
  disableEveryone: false,
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds
  ]
});

//ReadyBot
client.on('ready', () => {
    console.log('Logged in.')
    client.user.setStatus('available')
    client.user.setPresence({
        game: {
            name: '!help',
        }
    });
});

//onMessage
client.on(Events.MessageCreate, async msg => {
  if(!msg.author.bot){ 
    if (msg.content.toLowerCase() === 'dimelo' || msg.content.toLowerCase() === 'dímelo' || msg.content.toLowerCase().includes('dimelo') || msg.content.toLowerCase().includes('dímelo')) {
      QuoteController.getRandomMessage().then((message)=>{
        msg.channel.send(message);
      });
    }
    if (msg.content.toLowerCase() === 'chiste' || msg.content.toLowerCase() === 'chiste' ) {
      JokeController.getRandomJoke().then((message)=>{
        msg.channel.send(message);
      });
    }
    if (msg.content.includes('!agregar') && !msg.content.includes('!agregarTwitchStream')) {
      let message = msg.content.substring('!agregar '.length);
      QuoteController.addMessage(message, msg.author.username);
      msg.reply('Mensaje Añadido!!!')
    }
    if (msg.content.includes('!dimeloTodo') || msg.content.includes('!dímeloTodo')) {
     QuoteController.getAllMessages().then((messages)=>{
        messages.forEach(el => {
            msg.channel.send(el);
          });
        });
    }
  }
});


client.login(process.env.DISCORD_TOKEN);
