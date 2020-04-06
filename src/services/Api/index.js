import axios from 'axios'

let API_URL = "API_URL_REPLACE_ME"

if (process.env.REACT_APP_NODE_ENV === "local") {
  API_URL = process.env.REACT_APP_API_URL;
}

const Api = axios.create({
  baseURL: API_URL
})

export default Api