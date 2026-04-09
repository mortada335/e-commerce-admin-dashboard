import { axiosPrivate } from "@/api/axios"
import { clearPermissions } from "@/pages/home/store"
import { clearAccessToken, clearUserData } from "@/pages/login/store"
import { deleteCookieValue } from "@/utils/methods"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const useAxiosPrivate = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Add a response interceptor
    const interceptor = axiosPrivate.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          // Redirect user to '/login' page
          localStorage.removeItem("accessToken")
          localStorage.removeItem("userPermissions")
          localStorage.removeItem("user")
          deleteCookieValue("accessToken")
          clearAccessToken()
          clearUserData()
          clearPermissions()
          navigate("/login")
        }
        return Promise.reject(error)
      }
    )

    // Clean up interceptor on component unmount
    return () => {
      axiosPrivate.interceptors.response.eject(interceptor)
    }
  }, [navigate])

  return axiosPrivate
}
