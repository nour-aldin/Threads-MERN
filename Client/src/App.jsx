import { Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPage from "./Pages/UserPage"
import PostPage from "./Pages/PostPage"
import Header from "./Components/Header"
import HomePage from "./Pages/HomePage"
import AuthPage from "./Pages/AuthPage"
import UpdateProfilePage from "./Pages/UpdateProfilePage"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/userAtom"
import CreatePost from "./Components/CreatePost"

function App() {
  const user = useRecoilValue(userAtom)

  return (
    <Container maxW='650px'>
      <Header />
      <Routes>
        <Route
          path='/'
          element={user ? <HomePage /> : <Navigate to='/auth' />}
        />
        <Route
          path='/auth'
          element={!user ? <AuthPage /> : <Navigate to='/' />}
        />
        <Route
          path='/update'
          element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />}
        />
        <Route
          path='/:userName'
          element={
            user ? (
              <>
                <UserPage />
                <CreatePost />
              </>
            ) : (
              <UserPage />
            )
          }
        />
        <Route path='/:userName/post/:pId' element={<PostPage />} />
      </Routes>
      {/* {user && <LogoutButton />} */}
    </Container>
  )
}

export default App
