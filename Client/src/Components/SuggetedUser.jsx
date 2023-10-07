import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react"

const SuggetedUser = () => {
  const following = false
  const isUpdating = false
  const handleFollowUnFollow = () => {
    console.log("follow/unfollow")
  }

  return (
    <>
      <Flex justifyContent={"space-between"}>
        {/* RIGHT SIDE */}
        <Box>
          <Flex>
            <Box>
              <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
            </Box>
            <Box alignItems={"center"} mx={2}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                Name
              </Text>
              <Text fontSize={"sm"} color={"gray.light"}>
                UserName
              </Text>
            </Box>
          </Flex>
        </Box>
        {/* LEFT SIDE */}
        <Box>
          <Button
            size={"sm"}
            color={following ? "black" : "white"}
            bg={following ? "white" : "blue.400"}
            onClick={handleFollowUnFollow}
            isLoading={isUpdating}
            _hover={{
              color: following ? "black" : "white",
              opacity: ".8",
            }}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        </Box>
      </Flex>
    </>
  )
}
export default SuggetedUser
