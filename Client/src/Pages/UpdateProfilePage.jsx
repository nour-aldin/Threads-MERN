import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react"
import { useRef, useState } from "react"
import { useRecoilState } from "recoil"
import userAtom from "../atoms/userAtom"
import usePreviewImg from "../Hooks/usePreviewImg"
import useShowToast from "../Hooks/useShowToast"

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom)
  const [inputs, setInputs] = useState({
    name: user.name,
    userName: user.userName,
    email: user.email,
    bio: user.bio,
    password: "",
  })
  const fileRef = useRef(null)
  const showToast = useShowToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const {handleImgChange, imgUrl} = usePreviewImg()

  const handleSubmit = async (e) => {
    if(isUpdating) return
    e.preventDefault();
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...inputs, profilePicture: imgUrl}),
      });
      const data = await res.json();
      if (data.error) {
        return showToast("Error", data.error, "error")
      }
      showToast("Success", data.message, "success")
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
    } catch (error) {
      showToast("Error", error, "error")
    } finally {
      setIsUpdating(false)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
    <Flex align={"center"} justify={"center"}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.dark")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size='xl' boxShadow={'md'} src={imgUrl || user.profilePicture} />
            </Center>
            <Center w='full'>
              <Button w='full' onClick={() => fileRef.current.click()}>Change Avatar</Button>
              <Input type='file' hidden ref={fileRef} onChange={handleImgChange}/>
            </Center>
          </Stack>
        </FormControl>
        <FormControl >
          <FormLabel>Full Name</FormLabel>
          <Input
            placeholder='Full Name'
            _placeholder={{ color: "gray.500" }}
            type='text'
            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            value={inputs.name}
          />
        </FormControl>
        <FormControl >
          <FormLabel>User name</FormLabel>
          <Input
            placeholder='UserName'
            _placeholder={{ color: "gray.500" }}
            type='text'
            onChange={(e) => setInputs({ ...inputs, userName: e.target.value })}
            value={inputs.userName}
          />
        </FormControl>
        <FormControl >
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder='your-email@example.com'
            _placeholder={{ color: "gray.500" }}
            type='email'
            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            value={inputs.email}
          />
        </FormControl>
        <FormControl >
          <FormLabel>bio</FormLabel>
          <Input
            placeholder='your bio'
            _placeholder={{ color: "gray.500" }}
            type='text'
            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            value={inputs.bio}
          />
        </FormControl>
        <FormControl >
          <FormLabel>Password</FormLabel>
          <Input
            placeholder='password'
            _placeholder={{ color: "gray.500" }}
            type='password'
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            value={inputs.password}
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w='full'
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"green.400"}
            color={"white"}
            w='full'
            _hover={{
              bg: "green.500",
            }}
            type='submit'
            isLoading={isUpdating}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
    </form>
  )
}
