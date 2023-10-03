import { Button, Flex, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useShowToast from "../Hooks/useShowToast"
import Post from "../Components/Post"
import { useRecoilState } from "recoil"
import postsAtom from "../atoms/postsAtom"

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [isLoading, setIsLoading] = useState(true)

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
        console.log(posts)
      } catch (error) {
        showToast("Error", error.message, "error")
      } finally {
        setIsLoading(false)
      }
    }
    getFeedPosts()
  }, [setPosts])

  // if (isLoading) return (

  // )

  return (
    <>
      {isLoading && (
        <Flex justifyContent="center">
          <Spinner size="xl" />
        </Flex>
      )}
      {!isLoading && posts.length === 0 && <h1>Follow some Users to see the feed</h1>}

      {posts.map(post => (
        <Post key={post._id} post={post} />
      ))}
    </>
  )
}
export default HomePage
