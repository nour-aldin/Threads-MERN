import { useEffect, useState } from "react"
import UserHeader from "../Components/UserHeader"
import Post from "../Components/Post"
import { useParams } from "react-router-dom"
import useShowToast from "../Hooks/useShowToast"
import { Flex, Spinner } from "@chakra-ui/react"
import useGetUserProfile from "../Hooks/useGetUserProfile"
import { useRecoilState } from "recoil"
import postsAtom from "../atoms/postsAtom"

const UserPage = () => {
  const { user, isLoading } = useGetUserProfile()
  const [posts, setPosts] = useRecoilState(postsAtom)
  const { userName } = useParams()
  const showToast = useShowToast()
  const [isFetchingPosts, setIsFetchingPosts] = useState(true)

  useEffect(() => {
    const getPosts = async () => {
      setIsFetchingPosts(true)
      try {
        const res = await fetch(`/api/posts/user/${userName}`)
        const data = await res.json()
        if (data.error) {
          return showToast("Error", data.error, "error")
        }
        setPosts(data.posts)
      } catch (error) {
        showToast("Error", error.message, "error")
        setPosts([])
      } finally {
        setIsFetchingPosts(false)
      }
    }

    getPosts()
  }, [userName, setPosts])

  if (!user && isLoading)
    return (
      <Flex justify='center' align='center'>
        <Spinner size='xl' center />
      </Flex>
    )

  if (!user && !isLoading) return <h1>User Not found</h1>

  return (
    <>
      <UserHeader user={user} />
      {!isFetchingPosts && posts.length === 0 && <h1>User has no posts yet</h1>}

      {isFetchingPosts && (
        <Flex justify='center' my={12}>
          <Spinner size='xl' center />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </>
  )
}

export default UserPage
