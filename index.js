import {Client, GatewayIntentBits, Events } from 'discord.js';

import QuoteController from './controllers/QuoteController.js';
import JokeController from './controllers/JokeController.js';
import MovieController from './controllers/MovieController.js';
import CurrencyControler from './controllers/CurrencyControler.js';

import {validate_dimelo} from './utils/index.js'
import BirthdayControler from './controllers/BirthdayControler.js';

import {CronJob as cron} from 'cron'


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




const sendMessageDaily = new cron('0 0,9,13,21 * * *', async function() {
  const guild = client.guilds.cache.get('366511816358232072');

  if (guild) {
    const ch = guild.channels.cache.get('366511816358232075');
    const birthdays = await BirthdayControler.getTodayBirthdays();

    for (let user of birthdays) {
      await ch.send({ 
        content: '@everyone Feliciten a ' + user + ' por su cumple !'
      }).catch(err => {
          console.error(err);
      });
    }
  }
});
sendMessageDaily.start();


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
    if ( msg.content.trim().length==11 && msg.content.trim().toLowerCase().substring(0,8) == '!cambio ' && msg.content.trim().toLowerCase() !== '!cambio usd') {
      CurrencyControler.getCurrentExchangeOthers(msg.content.trim().substring(8,11).toUpperCase()).then((message)=>{
        msg.channel.send(message);
      });
    }
    else if (msg.content.trim().toLowerCase()== '!cambio' || msg.content.trim().toLowerCase() == '!cambio usd') {
      CurrencyControler.getCurrentExchangeUSD().then((message)=>{
        msg.channel.send(message);
      });
    }

    if (msg.content.startsWith('!agregarCumple' )) {
      const birhtdayMessage = await BirthdayControler.addBirthday(msg.content, msg.author.username);
      msg.channel.send(birhtdayMessage);
    }
    
  }
});


client.login(process.env.DISCORD_TOKEN);


