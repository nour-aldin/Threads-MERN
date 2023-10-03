import {
  VStack,
  Box,
  Flex,
  Avatar,
  Text,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  useToast,
  Button,
} from "@chakra-ui/react"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import { useRecoilValue } from "recoil"
import userAtom from "../Atoms/userAtom"
import { Link as RouterLink } from "react-router-dom"
import { useState } from "react"
import useShowToast from "../Hooks/useShowToast"

const UserHeader = ({ user }) => {
  const toast = useToast()
  const currentUser = useRecoilValue(userAtom)
  const [isFollowing, setIsFollowing] = useState(
    user.followers.includes(currentUser?._id)
  )
  const showToast = useShowToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const copyURL = () => {
    const currentURL = window.location.href
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
      })
    })
  }

  const handleFollow = async () => {

    if(!currentUser) return showToast("Error", "Please login to follow", "error")
    if(isUpdating) return

    setIsUpdating(true)

    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

      })
      const data = await res.json()
      if (data.error) {
        return showToast("Error", data.error, "error")
      }
      if (isFollowing) {
        showToast("Success", `Unfollowed ${user.name}`, "success")
        user.followers = user.followers.filter(id => id !== currentUser?._id)
      } else {
        showToast("Success", `Followed ${user.name}`, "success")
        user.followers.push(currentUser?._id)
      }
      setIsFollowing(!isFollowing)
    } catch (error) {
      showToast("Error", error.message, "error")
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) return
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w='full'>
        <Box>
          <Text fontSize='2xl' fontWeight='bold'>
            {user.name}
          </Text>
          <Flex gap={2} alignItems='center'>
            <Text fontSize='sm'>{user.userName}</Text>
            <Text
              fontSize='xs'
              bg={"gray.dark"}
              color={"gray.light"}
              p='1'
              borderRadius='full'
              marginTop='2px'
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePicture ? (
            <Avatar name={user.name} src={user.profilePicture} size='xl' />
          ) : (
            <Avatar
              name={user.name}
              src='https://bit.ly/broken-link'
              size='xl'
            />
          )}
        </Box>
      </Flex>

      <Text> {user.bio} </Text>
      {currentUser?._id === user._id && (
        <RouterLink to='/update'>
          <Button size='sm'>Update Profile</Button>
        </RouterLink>
      )}
      {currentUser?._id !== user._id && (
          <Button size='sm' onClick={handleFollow} isLoading={isUpdating}>{isFollowing ? "Unfollow" : "Follow"}</Button>
      )}
      <Flex w='full' justifyContent='space-between'>
        <Flex gap='2' alignItems='center'>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w='1' h='1' bg={"gray.light"} borderRadius='full'></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className='icon-container'>
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className='icon-container'>
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w='full'>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb='3'
          cursor='pointer'
        >
          <Text fontWeight={"bold"}> Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb='3'
          cursor='pointer'
        >
          <Text fontWeight={"bold"}> Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  )
}

export default UserHeader
