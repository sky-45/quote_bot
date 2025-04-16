import BirthdayModel from '../models/Birthday.js'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'

import { getCurrentTime} from '../utils/index.js'

dayjs.extend(utc)

class BirthdayController {
  async getAllBirthdays() {
    try {
      const day = dayjs()

      const allBirthdays = await BirthdayModel.find().sort({month: 1, day: 1}).lean()
      
      return allBirthdays.map(el=> {
        return {
          user: el.user,
          years: day.get('year') - el.year,
          formatedDate: ' ' + el.day + ' de ' + MONTHS_LABEL[el.month],
          month:el.month,
          day:el.day
        }
      })
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error getAllBirthdays:`, error)
      return []
    }
  }

  async notifyBirthday() {
    try {
      const birthdays = await this.getTodayBirthdays();

    } catch (error) {
      console.log(`[${getCurrentTime()}] Error notifyBirthday:`, error)
    }
  }
  
  async getTodayBirthdays() {
    try {
      const day = dayjs()

      const todayBirthdays = await BirthdayModel.find({
        month:day.get('month') + 1,
        day:day.get('date')
      }).lean()
      
      return todayBirthdays.map(el=> {
        return {
          user: el.user,
          years: day.get('year') - el.year
        }
      })
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error getTodayBirthdays:`, error)
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
      console.log(`[${getCurrentTime()}] Error addBirthday:`, error)
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
      console.log(`[${getCurrentTime()}] Error parseBirhdayMessage:`, error)
    }
  }
  
  formatAllBirthdays(birhtdayMessages) { 
    try {
      const day = dayjs()
      const current_day = day.get('date')
      const current_month = day.get('month') + 1

      const finalMessage = 'Lista de cumpleaños: \n' + birhtdayMessages.map(elem=>{

        if(elem.month > current_month || (elem.month == current_month && elem.day > current_day)) {
          return '    '+elem.user + ' cumplira ' + elem.years +' años el ' + elem.formatedDate
        }
        else {
          return '    '+elem.user + ' cumplio ' + elem.years +' años el ' + elem.formatedDate
        }
        
      }).join('\n')

      return finalMessage
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error formatAllBirthdays:`, error)
    }
  }
}

const MONTHS_LABEL = {
  1:'Enero',
  2:'Febrero',
  3:'Marzo',
  4:'Abril',
  5:'Mayo',
  6:'Junio',
  7:'Julio',
  8:'Agosto',
  9:'Setiembre',
  10:'Octubre',
  11:'Noviembre',
  12:'Diciembre'  
}

export default new BirthdayController()