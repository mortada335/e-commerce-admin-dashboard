import { getCookieValue } from "@/utils/methods"
import axios from "axios"

export default axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

// Add a request interceptor
axiosPrivate.interceptors.request.use(
  (config) => {
    const savedAccessToken = getCookieValue("accessToken")

    if (savedAccessToken) {
      config.headers.Authorization = `Token ${savedAccessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
