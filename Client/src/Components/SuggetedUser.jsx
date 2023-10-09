import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import useShowToast from "../Hooks/useShowToast"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"

const SuggetedUser = ({ user }) => {
  const currentUser = useRecoilValue(userAtom)
  const [isFollowing, setIsFollowing] = useState(
    user.followers.includes(currentUser?._id)
  )
  const [isUpdating, setIsUpdating] = useState(false)
  const showToast = useShowToast()
  // const isUpdating = false
  const handleFollowUnFollow = async () => {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await res.json()
      if (data.error) return showToast("Error", data.error, "error")
      if (isFollowing) {
        showToast("Success", `Unfollowed ${user.name}`, "success")
        user.followers = user.followers.filter((id) => id !== currentUser?._id)
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

  return (
    <>
      <Flex justifyContent={"space-between"}>
        {/* RIGHT SIDE */}
        <Box>
          <Flex>
            <Box>
              <Avatar name={user.name} src={user.profilePicture} />
            </Box>
            <Box alignItems={"center"} mx={2}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user.name}
              </Text>
              <Text fontSize={"sm"} color={"gray.light"}>
                {user.userName}
              </Text>
            </Box>
          </Flex>
        </Box>
        {/* LEFT SIDE */}
        <Box>
          <Button
            size={"sm"}
            color={isFollowing ? "black" : "white"}
            bg={isFollowing ? "white" : "blue.400"}
            onClick={handleFollowUnFollow}
            isLoading={isUpdating}
            _hover={{
              color: isFollowing ? "black" : "white",
              opacity: ".8",
            }}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </Box>
      </Flex>
    </>
  )
}
export default SuggetedUser
