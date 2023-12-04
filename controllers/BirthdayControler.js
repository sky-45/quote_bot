import BirthdayModel from '../models/Birthday.js'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
dayjs.extend(utc)

class BirthdayController {
  async getTodayBirthdays() {
    try {
      const day = dayjs()
      const todayBirthdays = await BirthdayModel.find({
        month:day.get('month') + 1,
        day:day.get('date')
      }).lean()
      
      return todayBirthdays.map(el=> el.user)
    } catch (error) {
      console.log('error getting birthdays')
      return []
    }
  }

  async addBirthday(message,author) {
    try {
      const {user, year, month, day} = this.parseBirhdayMessage(message)
      const birthday = {
        user,
        year,
        month,
        day,
        addedBy: author
      }

      const newBirthday = await BirthdayModel.create(birthday)

      return "Cumple de " + newBirthday.user +" agregado !"
    } catch (error) {
      console.log('error agregando cumple', error)
      return "Error agregando cumpleaños, prueba denuevo monse !"
    }
  }

  parseBirhdayMessage(message) {
    try {
      const user_idx = message.indexOf("user")
      const message_user = message.substring(user_idx).split("'")[1]

      const date_idx = message.indexOf("fecha")
      const message_fecha = message.substring(date_idx).split("'")[1]

      const [year,month,day] = message_fecha.split("-");

      return {
        user: message_user,
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day)
      }

    } catch (error) {
      throw Error
    }
  }
}

export default new BirthdayController()