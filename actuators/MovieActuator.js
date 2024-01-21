// import MovieController from './controllers/MovieController.js';

import MovieController from '../controllers/MovieController.js'


export const MovieActuator = async ( msg )=> {
  try {
    if (msg.content.startsWith('!agregarPeli ')) {
      const title = msg.content.substring('!agregarPeli '.length);
      await MovieController.addMovie(title, msg.author.username);
      msg.reply('Pelicula Añadida!!!')
    }
  
    if (msg.content.trim() == '!listaPelis' ) {
      const moviesMessage = await MovieController.getMovies();
      msg.channel.send(moviesMessage);
    }
  
    if (msg.content.startsWith('!eliminarPeli ')) {
      const title = msg.content.substring('!eliminarPeli '.length).trim();
      const deleteStatus = await MovieController.deleteMovie(title);
      if(deleteStatus.status) {
        msg.reply('Pelicula eliminada :c !!!')
      }
      else{
        msg.reply(deleteStatus.text)
      }
    }
  } catch (error) {
    console.log(error)
  }
}