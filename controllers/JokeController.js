import axios from 'axios';

class JokeController {
  async getRandomMonseJoke() {
    try {
      const { data: joke } = await axios.get('https://icanhazdadjoke.com/', { 
        headers: { 
          "Accept": "text/plain",
          "User-Agent": "axios 0.21.1"
        }
      })

      return  '```' + joke + '```'
    } catch (error) {
      console.log('error', error)

      return 'zzz - chistes monses desactivados temporalmente'
    }
  }

  async getRandomJoke() {
    try {
      const { data: {setup, punchline} } = await axios.get('http://localhost:3005/jokes/random', { 
        headers: { 
          "Accept": "text/plain",
          "User-Agent": "axios 0.21.1"
        }
      })

      return  '```' + setup + ' - ' + punchline + '```'
    } catch (error) {
      console.log('error', error)

      return 'zzz - chistes desactivados temporalmente'
    }
  }

}

export default new JokeController()