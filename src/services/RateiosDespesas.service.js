//import axios from 'axios'
import api from './Api'

const authHeader = {
  'Content-Type': 'application/json'
}

// const API_URL = 'http://127.0.0.1:8000/'

// export const getListaRateiosDespesas = async () => {
//   const response = await axios.get(
//     `${API_URL}api/rateios-despesas/`,
//     authHeader
//   )
//   return response.data
// }

export const getListaRateiosDespesas = async uuid => {
  return (await api.get('api/rateios-despesas/', authHeader)).data
}
