import BirthdayControler from '../controllers/BirthdayControler.js'

export const BirthdayActuator = async (msg)=> {
  try {
    if (msg.content.startsWith('!agregarCumple' )) {
      const birhtdayMessage = await BirthdayControler.addBirthday(msg.content, msg.author.username);
      msg.channel.send(birhtdayMessage);
    }
    
    if (msg.content.trim() == '!saludarCumple' ) {
      const birhtdayMessages = await BirthdayControler.getTodayBirthdays();

      for (let elem of birhtdayMessages) {
        await msg.channel.send('```' + 'Monses Feliciten a ' + elem.user + ' por sus terribles ' + elem.years +' años !' + '```');
      }
    }

    if (msg.content.trim() == '!cumples') {
      const birhtdayMessages = await BirthdayControler.getAllBirthdays();
      const finalMessage_ = BirthdayControler.formatAllBirthdays(birhtdayMessages)
      msg.channel.send('```' + finalMessage_ + '```')
    }
    
  } catch (error) {
    console.log(error)
  }
}