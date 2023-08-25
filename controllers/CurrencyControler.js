import axios from 'axios';

const {URL_CURRENCY_API = 'https://api.apis.net.pe/v1/tipo-cambio-sunat'} = process.env

class CurrencyController {
  async getCurrentExchange() {
    try {
      const { data: {compra, venta, fecha} } = await axios.get(`${URL_CURRENCY_API}`, { 
        // headers: { 
        //   "Accept": "text/plain",
        //   "User-Agent": "axios 0.21.1"
        // }
      })
      return '```' + `TC hoy ${fecha}: Compra = ${compra} - Venta = ${venta} !` + '```' 
    } catch (error) {
      console.log('error', error)

      return 'zzz - tipo de cambio murio'
    }
  }

}

export default new CurrencyController()