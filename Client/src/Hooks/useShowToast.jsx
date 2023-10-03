import { useToast } from "@chakra-ui/react"

const useShowToast = () => {
  const toast = useToast()
  const showToast = (title, decription, status) => {
    toast({
      title,
      description: decription,
      status,
      duration: 3000,
      isClosable: true,
    })
  }
  return showToast
}
export default useShowToast