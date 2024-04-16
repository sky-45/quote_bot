import PointsModel from '../models/Points.js'
import lodash from 'lodash'

class PointsController {
  async addPoints(userId, points = 1) {
    try {

      const user = await PointsModel.findOne({
        userId: userId
      }).lean()
      
      if(user) {
        await PointsModel.updateOne({
          userId: userId
        },{
          points: user.points + points
        })
      }
      else {
        await PointsModel.create({
          userId: userId,
          points: points
        })
      }
      return

    } catch (error) {
      console.log('error adding poitns', error)
    }
  }

  async getPoints(userId) {
    try {

      const user = await PointsModel.findOne({
        userId: userId
      }).lean()

      return user?.points || 0

    } catch (error) {
      console.log('error getting gpoitns of ',userId)
    }
  }

  async getAllUserPoints(top = 10) {
    try {

      const users = await PointsModel.find({}).sort({points: 'desc'}).limit(top).lean()

      return users || []

    } catch (error) {
      console.log('error getting gpoitns of ',userId)
    }
  }

  async formatPointsMessage(userPoints, client) {
    try {
      let usernames = await Promise.all(userPoints.map((user)=>{
        return client.users.fetch(user.userId);
      }))
      
      usernames = usernames.map(user => {
        return {
          id: user.id,
          username: user.username
        }
      })
      // console.log('userPoints',userPoints)
      // console.log('usernames', usernames)
      const userNamesById = lodash.keyBy(usernames,'id')
      // console.log('userNamesById', userNamesById)

      const message = 'Top 10 monses <:navigab:657774495515410443> : \n' + userPoints.map((user, idx)=>{
        return  `${idx+1}.- ${userNamesById[user.userId].username} tiene ${user.points} puntos.`
      }).join('\n')

      return message
      
    } catch (error) {
      console.log('error formating points of users',userId)
    }
  }

}

export default new PointsController()