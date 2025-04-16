import MovieModel from '../models/Movie.js'
import { getCurrentTime} from '../utils/index.js'

const statusFormat = {
  'watched': 'Vista',
  'watching': 'Viendo',
  'toWatch': 'Por ver'
}

class MovieController {
  async addMovie(title, author) {
    try {
      const totalMovies = await MovieModel.countDocuments({})
      const movie = {
        title  : title.trim(),
        addedBy: author,
        status: 'toWatch',
        number: totalMovies + 1
      }

      const newMovie = await MovieModel.create(movie)

      return newMovie
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error MovieController-addMovie:`, error)
    }
  }

  async getMovies() {
    try {
      const movies = await MovieModel.find()

      const orderedMovies = movies.sort((a,b) => a.number - b.number);

      const formatedMessage =  '```' + orderedMovies.map((el) => {
        return `${el.number} - ${el.title} - ${statusFormat[el.status]}`
      }).join(' \n') + '```';

      return formatedMessage
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error MovieController-getMovies:`, error)
    }
  }

  async deleteMovie(title) {
    try {
      const movie = await MovieModel.findOne({ title })
      if(!movie) {
        return {status: false, text: 'No se encontro la pelicula'}
      }

      await MovieModel.deleteOne({ title })

      return {
        status: true,
        text: 'Pelicula eliminada'
      }

    } catch (error) {
      console.log(`[${getCurrentTime()}] Error MovieController-deleteMovie:`, error)
    }
  }

}

export default new MovieController()