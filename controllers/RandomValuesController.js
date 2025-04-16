import axios from 'axios';
import RedisController from './RedisController.js'

import { getCurrentTime} from '../utils/index.js'

class RandomValuesController {
  async getMeassureByID(userid) {
    try {

      const size_redis = await this.getUserMeassure(userid)
      const label = `A ${userid} le mide ${size_redis} cm! <:navigab:657774495515410443> ${this.getLabelMeMide(size_redis)}`

      return label 
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error RandomValuesController-getMeassureByID:`, error)

      return 'zzz - muy pequeño '
    }
  }



  async getUserMeassure(userid){
    try {
      let size_redis = await RedisController.getRedis(`memide-${userid}`)

      if(size_redis) return (typeof size_redis == 'string') ? Number(size_redis) : size_redis 

      size_redis = Math.floor(Math.random() * 25) - 5

      await RedisController.setRedis(`memide-${userid}`, size_redis, 60*60*12)

      return size_redis
      
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error RandomValuesController-getUserMeassure:`, error)

      return 'zzz - muy pequeño '
    }
  }

  getLabelMeMide(size){
    try {
      let num = (typeof size == 'string') ? Number(size) : size
      if(num < 0) return 'Pa adentro!'
      if(num == 0) return 'Fuera de este mundo D:'
      if(num < 5) return 'Lo que importa es como lo uses crack !'
      if(num < 10) return 'Chalón'
      return 'Esa cosa debería de tener DNI'
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error RandomValuesController-getLabelMeMide:`, error)
    }

  }
}

export default new RandomValuesController()