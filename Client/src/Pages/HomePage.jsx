import { Box, Flex, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useShowToast from "../Hooks/useShowToast"
import Post from "../Components/Post"
import { useRecoilState } from "recoil"
import postsAtom from "../atoms/postsAtom"
import { SuggetedUsers } from "../Components/SuggetedUsers"

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [isLoading, setIsLoading] = useState(true)
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const showToast = useShowToast()

  useEffect(() => {
    const getFeedPosts = async () => {
      setIsLoading(true)
      setPosts([])
      try {
        const res = await fetch("/api/posts/feed")
        const data = await res.json()
        if (data.error) return showToast("Error", data.error, "error")
        setPosts(data.feedPosts)
        // console.log(posts)
      } catch (error) {
        showToast("Error", error.message, "error")
      } finally {
        setIsLoading(false)
      }
    }
    const geSuggetedUsers = async () => {
      try {
        const response = await fetch("/api/users/suggetedUsers")
        const data = await response.json()
        if (data.error) return showToast("Error", data.error, "error")
        setSuggestedUsers(data.users)
        // console.log(data.users)
      } catch (error) {
        showToast("Error", error.message, "error")
      }
    }
    geSuggetedUsers()
    getFeedPosts()
  }, [setPosts])

  // if (isLoading) return (

  // )

  return (
    <Flex gap='10' alignItems='flex-start'>
      <Box flex='70'>
        {isLoading && (
          <Flex justifyContent='center'>
            <Spinner size='xl' />
          </Flex>
        )}
        {!isLoading && posts?.length === 0 && (
          <h1>Follow some Users to see the feed</h1>
        )}

        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </Box>
      <Box flex='30'>
        <SuggetedUsers users={suggestedUsers} />
      </Box>
    </Flex>
  )
}
export default HomePage
