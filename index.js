import {Client, GatewayIntentBits, Events } from 'discord.js';

import QuoteController from './controllers/QuoteController.js';
import JokeController from './controllers/JokeController.js';
import MovieController from './controllers/MovieController.js';

import {validate_dimelo} from './utils/index.js'


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
    // if (msg.content.toLowerCase() === 'dimelo' || msg.content.toLowerCase() === 'dímelo' || msg.content.toLowerCase().includes('dimelo') || msg.content.toLowerCase().includes('dímelo')) {
    //   QuoteController.getRandomMessage().then((message)=>{
    //     msg.channel.send(message);
    //   });
    // }
    if(validate_dimelo(msg.content)) {
      QuoteController.getRandomMessage().then((message)=>{
        msg.channel.send(message);
      });
    }
    if (msg.content.toLowerCase() === 'chiste monse' ) {
      JokeController.getRandomMonseJoke().then((message)=>{
        msg.channel.send(message);
      });
    }
    if (msg.content.toLowerCase() === 'chiste' ) {
      JokeController.getRandomJoke().then((message)=>{
        msg.channel.send(message);
      });
    }
    if (msg.content.startsWith('!agregar ')) {
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

    if (msg.content.startsWith('!agregarPeli ')) {
      const title = msg.content.substring('!agregarPeli '.length);
      await MovieController.addMovie(title, msg.author.username);
      msg.reply('Pelicula Añadida!!!')
    }

    if (msg.content.trim() == '!listaPelis' ) {
      const moviesMessage = await MovieController.getMovies();
      msg.channel.send(moviesMessage);
    }

    if (msg.content.startsWith('!eliminarPeli ')) {
      const title = msg.content.substring('!eliminarPeli '.length).trim();
      const deleteStatus = await MovieController.deleteMovie(title);
      if(deleteStatus.status) {
        msg.reply('Pelicula eliminada :c !!!')
      }
      else{
        msg.reply(deleteStatus.text)
      }
    }
    
  }
});


client.login(process.env.DISCORD_TOKEN);


