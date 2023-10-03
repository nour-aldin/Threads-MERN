import { useState } from "react"
import useShowToast from "./useShowToast"

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState('')
  const showToast = useShowToast()

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImgUrl(reader.result)
      }

      reader.readAsDataURL(file)
    } else {
      showToast("Error", "Please upload an image file", "error")
      setImgUrl('')
    }

  }
  return { imgUrl, handleImgChange, setImgUrl}
}
export default usePreviewImg