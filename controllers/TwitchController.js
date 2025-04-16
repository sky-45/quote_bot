import axios from 'axios';
import { Error } from 'mongoose';

import RedisController from './RedisController.js'
import ChannelModel from '../models/Channels.js';

import { getCurrentTime} from '../utils/index.js'

const { CLIENT_ID, CLIENT_SECRET } = process.env

class TwitchController {
  async getAccessToken() {
    try {
      let access_token = await RedisController.getRedis('bearer')

      if(access_token) return access_token

      access_token = await this.updateAccessToken()

      return access_token

    } catch (error) {
      console.log('error', error)
      throw new Error()
    }
  }

  async updateAccessToken() {
    try {
      const { data: {access_token, expires_in} } = await axios.post('https://id.twitch.tv/oauth2/token',null,
        {
          params: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'client_credentials'
          }
        }
      )

      await RedisController.setRedis('bearer',access_token,expires_in)

      return access_token

    } catch (error) {
      console.log(`[${getCurrentTime()}] Error TwitchController-updateAccessToken:`, error)
    }
  }

  async getChannel(channel, live_only=false) {
    try {
      const access_token = await this.getAccessToken()
      const {data:{ data: streams= [] }} = await axios.get('https://api.twitch.tv/helix/search/channels',{
        headers:{
          'client-id': CLIENT_ID,
          'Authorization': `Bearer ${access_token}`
        },
        params:{
          query: channel,
          live_only,
          first: 1
        }
      })

      if(streams.length == 0) throw new Error()

      const {broadcaster_login, is_live} = streams[0]
      return {
        channelName: broadcaster_login,
        is_live
      }

    } catch (error) {
      console.log(`[${getCurrentTime()}] Error TwitchController-getChannel:`, error)
    }
  }

  async addChannel(query, addedBy) { 
    try {
      const {channelName} = await this.getChannel(query)
      const existingChannels = await this.getFollowedChannels()
      const exists = existingChannels?.filter(el => el.name == query) || []
      
      if(channelName != query ) return 'Escribe bien el canal monse !'
      if(exists.length > 0) return 'El canal ya existe monse !'
      

      await ChannelModel.create({
        name  : channelName,
        addedBy
      })

      return 'Canal ' + query + ' añadido correctamente !'

    } catch (error) {
      console.log(`[${getCurrentTime()}] Error TwitchController-addChannel:`, error)
    }
  }

  async getFollowedChannels() {
    try {
      const followedChannels = await ChannelModel.find().lean()

      return followedChannels
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error TwitchController-getFollowedChannels:`, error)
    }
  }

  async getLiveChannels() {
    try {
      const followedChannels = await this.getFollowedChannels()
      const liveChannels = []

      for(const followChannel of followedChannels){
        const {is_live} = await this.getChannel(followChannel.name)
        if(is_live) liveChannels.push(followChannel.name)
      }
     
      return liveChannels
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error TwitchController-getLiveChannels:`, error)
      return []
    }
  }


  async notifyChannelsLive(channels = [], chat){
    try {
      const channelsPendingNotify = []

      for(const chann of channels){
        const isNotified = await RedisController.getRedis(`Notified-${chann}`)
        if(!isNotified) {
          channelsPendingNotify.push(chann)
          const status_rEdd = await RedisController.setRedis(`Notified-${chann}`,'true' ,60*60)
        }
      }

      for(const livechannel of channelsPendingNotify){
        await chat.send({ 
          content: '@everyone  Monses ' + livechannel + ' esta en vivo: https://twitch.tv/' + livechannel +' !'
        }).catch(err => {
            console.error(err);
        });
      }

    } catch (error) {
      console.log(`[${getCurrentTime()}] Error TwitchController-notifyChannelsLive:`, error)
      return []
    }
  }
}



export default new TwitchController()