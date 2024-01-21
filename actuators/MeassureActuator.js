import RandomValuesController from '../controllers/RandomValuesController.js'


export const MeassureActuator = async (msg)=> {
  try {
    if (msg.content.trim().toLowerCase() == '!memide') {
      
      const userid = "<@" + msg.author.id + ">"
      const label = await RandomValuesController.getMeassureByID(userid)

      msg.channel.send(label)
    }

    else if (msg.content.trim().toLowerCase().startsWith('!memide ') && msg.mentions.users.size > 0) {
      const [firstUser, ...restUsers ] =  Array.from(msg.mentions.users.values())
      
      const userid = "<@" + firstUser.id + ">"
      const label = await RandomValuesController.getMeassureByID(userid)

      msg.channel.send(label)

    }

  } catch (error) {
    console.log(error)
  }
}
