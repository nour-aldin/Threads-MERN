import { AddIcon } from "@chakra-ui/icons"
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { useRef, useState } from "react"
import usePreviewImg from "../Hooks/usePreviewImg"
import { BsFillImageFill } from "react-icons/bs"
import useShowToast from "../Hooks/useShowToast"
import { useRecoilState } from "recoil"
import postsAtom from "../atoms/postsAtom"
import { useParams } from "react-router-dom"
import userAtom from "../atoms/userAtom"

const MAX_TEXT_LENGTH = 500

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [postText, setPostText] = useState("")
  const [remainingText, setRemainingText] = useState(MAX_TEXT_LENGTH)
  const { handleImgChange, imgUrl, setImgUrl } = usePreviewImg()
  const fileRef = useRef(null)
  const showToast = useShowToast()
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useRecoilState(postsAtom)
  const { userName } = useParams()
  const user = useRecoilState(userAtom)

  const handleTextChange = (e) => {
    const inputText = e.target.value
    if (inputText.length > MAX_TEXT_LENGTH) {
      const trancatedText = inputText.slice(0, MAX_TEXT_LENGTH)
      setPostText(trancatedText)
      setRemainingText(0)
    } else {
      setPostText(inputText)
      setRemainingText(MAX_TEXT_LENGTH - inputText.length)
    }
  }

  const handleCreatePost = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: postText, image: imgUrl }),
      })
      const data = await res.json()
      if (data.error) {
        return showToast("Error", data.error, "error")
      }
      if (userName === user[0].userName) {
        showToast("Success", data.message, "success")
        setPosts([data.newPost, ...posts])
      } else {
        showToast("Success", "Posted on your own page :)", "success")
      }
    } catch (error) {
      showToast("Error", error.message, "error")
    } finally {
      setIsLoading(false)
      setPostText("")
      setImgUrl("")
      onClose()
    }
  }
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="What's on your mind?"
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={1}
                color={"gray.800"}
              >
                {remainingText}/{MAX_TEXT_LENGTH}
              </Text>
              <Input
                type='file'
                hidden
                ref={fileRef}
                onChange={handleImgChange}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => fileRef.current.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w='full' position={"relative"}>
                <Image src={imgUrl} alt='selected image' />
                <CloseButton
                  onClick={() => setImgUrl("")}
                  bg='gray.800'
                  position='absolute'
                  top='2'
                  right='2'
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={handleCreatePost}
              isLoading={isLoading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default CreatePost
