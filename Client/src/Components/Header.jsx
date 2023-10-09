import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import userAtom from "../atoms/userAtom"
import { Link as routerLink } from "react-router-dom"
import { AiFillHome } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import { FiLogOut } from "react-icons/fi"
import useLogout from "../Hooks/useLogout"
import authScreenAtom from "../atoms/authAtom"

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const user = useRecoilValue(userAtom)
  const setAuthScreen = useSetRecoilState(authScreenAtom)
  const logout = useLogout()

  return (
    <Flex justifyContent='space-between' mt={6} mb={12}>
      {user && (
        <Link as={routerLink} to='/'>
          <AiFillHome size='24' />
        </Link>
      )}
      {!user && (
        <Link as={routerLink} to='auth' onClick={() => setAuthScreen("login")}>
          Login
        </Link>
      )}
      <Image
        w={6}
        cursor={"pointer"}
        alt='logo'
        src={colorMode === "light" ? "/dark-logo.svg" : "/light-logo.svg"}
        // src={'/light-logo.svg'}
        onClick={toggleColorMode}
      />
      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={routerLink} to={`/${user.userName}`}>
            <RxAvatar size='24' />
          </Link>
          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}
      {!user && (
        <Link
          as={routerLink}
          to='/auth'
          onClick={() => setAuthScreen("register")}
        >
          Signup
        </Link>
      )}
    </Flex>
  )
}

export default Header
