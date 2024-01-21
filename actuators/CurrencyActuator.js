import CurrencyControler from '../controllers/CurrencyControler.js'

export const CurrencyActuator = async (msg)=> {
  try {

    if ( msg.content.trim().length==11 && msg.content.trim().toLowerCase().substring(0,8) == '!cambio ' && msg.content.trim().toLowerCase() !== '!cambio usd') {
      
      const message = await CurrencyControler.getCurrentExchangeOthers(msg.content.trim().substring(8,11).toUpperCase())
      
      msg.channel.send(message)
    }
    else if (msg.content.trim().toLowerCase()== '!cambio' || msg.content.trim().toLowerCase() == '!cambio usd') {

      const message = await CurrencyControler.getCurrentExchangeUSD()

      msg.channel.send(message)
    }
    
  } catch (error) {
    console.log(error)
  }
}