import { Avatar, Divider, Flex, Text } from "@chakra-ui/react"
// import { BsThreeDots } from "react-icons/bs" 

const Comment = ({ reply, lastReply }) => {
  return (
    <>
      <Flex gap='4' py='2' my='2' w='full'>
        <Avatar src={reply?.profilePicture} size='sm' />
        <Flex gap='1' w='full' flexDirection='column'>
          <Flex w='full' justifyContent='space-between' alignItems='center'>
            <Text fontSize='sm' fontWeight='bold'>
             {reply?.userName}
            </Text>
            {/* <Flex gap='2' alignItems='center'>
              <Text fontSize='sm' color='gray.light'>
                {createdAt}
              </Text>
              <BsThreeDots />
            </Flex> */}
          </Flex>
          <Text fontSize='sm' color='gray.light'>
            {reply?.text}
          </Text>
          {/* <Actions /> */}
          {/* <Text fontSize={"sm"} color='gray.light'>
            {likes} likes
          </Text> */}
        </Flex>
      </Flex>
      {!lastReply ? <Divider my='3' /> : null}
    </>
  )
}
export default Comment
