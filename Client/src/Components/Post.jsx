import { Avatar, Flex, Box, Text, Image } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useShowToast from "../Hooks/useShowToast"
import Actions from "./Actions"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { DeleteIcon } from "@chakra-ui/icons"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import postsAtom from "../atoms/postsAtom"

const Post = ({ post }) => {
  const [user, setUser] = useState(null)
  const showToast = useShowToast()
  const currentUser = useRecoilValue(userAtom)
  const [posts, setPosts] = useRecoilState(postsAtom)

  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${post.postedBy}`)
        const data = await res.json()
        if (data.error) return showToast("Error", data.error, "error")
        setUser(data.user)
      } catch (error) {
        showToast("Error", error.message, "error")
        setUser(null)
      }
    }

    getUser()
  }, [post.postedBy])

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault()
      e.stopPropagation()
      if(!window.confirm("Are you sure you want to delete this post?")) return

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.error) return showToast("Error", data.error, "error")
      showToast("Success", data.message, "success")
      setPosts(posts.filter((p) => p._id !== post._id))
      
    } catch (error) {
      showToast("Error", error.message, "error")
    }
  }

  return (
    <Link to={`/${user?.userName}/post/${post._id}`}>
      <Flex gap='3' mb='4' py='5'>
        <Flex flexDirection='column' alignItems='center'>
          <Avatar
            size='md'
            name={user?.name}
            src={user?.profilePicture}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              navigate(`/${user?.userName}`)
            }}
          />
          <Box w='1px' h='full' bg='gray.light' my='2'></Box>
          <Box position='relative' w='full'>
            {post.replies.length === 0 && (
              <Text textAlign='center' size={"50px"}>
                🙄
              </Text>
            )}

            {post.replies[0] && (
              <Avatar
                size='xs'
                name='Jhon Doe'
                src={post.replies[0].profilePicture}
                position={"absolute"}
                top={"0px"}
                left='15px'
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size='xs'
                name='Jhon Doe'
                src={post.replies[1].profilePicture}
                position={"absolute"}
                bottom={"0px"}
                right='-5px'
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size='xs'
                name='Jhon Doe'
                src={post.replies[2].profilePicture}
                position={"absolute"}
                bottom={"0px"}
                left='4px'
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w='full'>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  navigate(`/${user?.userName}`)
                }}
              >
                {user?.userName}
              </Text>
              <Image src='/verified.png' w='4' h='4' ml='1' />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                width={32}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === user?._id && (
                <DeleteIcon
                  size={20}
                  onClick={
                    handleDeletePost
                  }
                />
              )}
            </Flex>
          </Flex>

          <Text fontSize='sm'>{post.text}</Text>
          {post.image && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.image} w='full' />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post}/>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  )
}

export default Post
