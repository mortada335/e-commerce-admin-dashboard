import axios from "axios"
import { getCookieValue } from "./methods"

const { create } = axios

const axiosInstance = create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
})

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const savedAccessToken = getCookieValue("accessToken")

    if (!savedAccessToken) {
      // Redirect to login page, if no access token found.
      window.location.href("/login")

      // Return reject the promise.
      return Promise.reject("No access token found. Redirecting to login.")
    }

    config.headers.Authorization = `Token ${savedAccessToken}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
