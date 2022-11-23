import QuoteModel from '../models/Quote.js'

class QuoteController {
  async getRandomMessage() {
    try {
      const [randomQuote = 'arf'] = await QuoteModel.aggregate([{ $sample: { size: 1 } }])

      return randomQuote?.quote || 'zzz'
    } catch (error) {
      console.log('error', error)
    }
  }

  async addMessage(message, author) {
    try {
      const quote = {
        quote  : '```' + message + '```',
        author : author
      }
      await QuoteModel.create(quote)
    } catch (error) {
      console.log('error', error)
    }
  }

  async getAllMessages() {
    try {
      const quotes = await QuoteModel.find()

      return quotes.map((el) => el?.quote)
    } catch (error) {
      console.log('error', error)
    }
  }
}

export default new QuoteController()