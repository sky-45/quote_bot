import {Client, GatewayIntentBits, Events } from 'discord.js';

import QuoteController from './controllers/QuoteController.js';
import JokeController from './controllers/JokeController.js';

import {MovieActuator} from './actuators/MovieActuator.js';
import {CurrencyActuator} from './actuators/CurrencyActuator.js';
import {BirthdayActuator} from './actuators/BirthdayActuator.js';
import {MeassureActuator} from './actuators/MeassureActuator.js';
import {ChatActuator} from './actuators/ChatActuator.js'


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




const sendMessageDailyEveryone = new cron('0 0 * * *', async function() {
  const guild = client.guilds.cache.get('366511816358232072');

  if (guild) {
    const ch = guild.channels.cache.get('366511816358232075');
    const birthdays = await BirthdayControler.getTodayBirthdays();

    for (let elem of birthdays) {
      await ch.send({ 
        content: '@everyone Monses feliciten a ' + elem.user + ' por sus terribles ' + elem.years +' años !'
      }).catch(err => {
          console.error(err);
      });
    }
  }
});

const sendMessageDailySimple = new cron('0 10,18 * * *', async function() {
  const guild = client.guilds.cache.get('366511816358232072');

  if (guild) {
    const ch = guild.channels.cache.get('366511816358232075');
    const birthdays = await BirthdayControler.getTodayBirthdays();

    for (let elem of birthdays) {
      await ch.send({ 
        content: '```' + 'Monses Feliciten a ' + elem.user + ' por sus terribles ' + elem.years +' años !' + '```'
      }).catch(err => {
          console.error(err);
      });
    }
  }
});

sendMessageDailyEveryone.start();
sendMessageDailySimple.start();

//onMessage
client.on(Events.MessageCreate, async msg => {
  if(!msg.author.bot){ 
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

    // actuator of pelis get message
    if(msg.content.toLowerCase().includes('peli'))
      await MovieActuator(msg)

    // actuator of exchange info
    if(msg.content.toLowerCase().includes('cambio'))
      await CurrencyActuator(msg)

    // actuator of birthdaysss
    if(msg.content.toLowerCase().includes('cumple'))
      await BirthdayActuator(msg)

    // actuator of memideee
    if(msg.content.toLowerCase().includes('mide'))
      await MeassureActuator(msg)
    
    // actuator of chatgpt
    if(msg.content.startsWith('!monsebot '))
      await ChatActuator(msg)
  
  }
});


client.login(process.env.DISCORD_TOKEN);


