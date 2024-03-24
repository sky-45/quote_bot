import PointsModel from '../models/Points.js'

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

}

export default new PointsController()