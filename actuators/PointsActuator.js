

import PointsController from '../controllers/PointsController.js'


export const PointsActuator = async (msg, client)=> {
  try {
    if (msg.content.trim().toLowerCase() == '!gpoints'  && msg.mentions.users.size == 0) {
      
      const points = await PointsController.getPoints(msg.author.id)

      msg.channel.send(`<@${msg.author.id}> tiene ${points} gpoints <:navigab:657774495515410443> `)

    }

    if (msg.content.trim().toLowerCase().startsWith('!gpoints ') && msg.mentions.users.size > 0) {
      const [firstUser, ...restUsers ] =  Array.from(msg.mentions.users.values())

      const points = await PointsController.getPoints(firstUser.id)

      msg.channel.send(`<@${firstUser.id}> tiene ${points} gpoints <:navigab:657774495515410443> `)
      
    }

    if (msg.content.trim().toLowerCase() == '!leaderboard') {
      
      const topUsers = await PointsController.getAllUserPoints(10)

      const message = await PointsController.formatPointsMessage(topUsers, client)

      msg.channel.send(message)

    }

  } catch (error) {
    console.log(error)
  }
}


