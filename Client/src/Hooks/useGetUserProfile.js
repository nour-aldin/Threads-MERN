import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useShowToast from "./useShowToast"

const useGetUserProfile = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { userName } = useParams()
  const showToast = useShowToast()
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${userName}`)
        const data = await res.json()
        if (data.error) {
          return showToast("Error", data.error, "error")
        }
        setUser(data.user)
      } catch (error) {
        showToast("Error", error.message, "error")
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [userName])

  return { user, isLoading }
}
export default useGetUserProfile
