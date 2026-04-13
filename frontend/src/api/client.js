import axios from 'axios'
import envConfig from '../../envConfig.js'

const api = axios.create({
  baseURL: envConfig.apiUrl || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('odp-token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
