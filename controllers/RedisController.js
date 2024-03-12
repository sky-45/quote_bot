import axios from 'axios';
import redis from 'redis'

const {URL_REDIS = 'redis'} = process.env
// console.log(URL_REDIS)

const redisClient = redis.createClient(6379, URL_REDIS) // { host: URL_REDIS, port: 6379 }
redisClient.on('error', (error) => { console.log('Redis not connected :c',redisClient.options, error)})
redisClient.on('connect', () => {console.log('Redis connected uwu')})
// console.log(JSON.stringify(redisClient.options))
await redisClient.connect();


class RedisController {
  async getRedis (key) {
    try {
      const value = await redisClient.get(key)
  
      return value
    } catch (error) {
      return undefined
    }
  }

  // delay in seconds 
  async setRedis(key, value, delay) {
    try {
      await redisClient.set(key, typeof value === 'object' ? JSON.stringify(value) : value,{EX: delay})

      return {key, value}
    } catch (error) {
      console.log('redis error',key,value)
      return undefined
    }
  }

  async deleteRedis(key) {
    try {
      // await redisClient.set(key, typeof value === 'object' ? JSON.stringify(value) : value,{EX: delay})
      await redisClient.del(key)

      return true
    } catch (error) {
      return undefined
    }
  }

}

export default new RedisController()