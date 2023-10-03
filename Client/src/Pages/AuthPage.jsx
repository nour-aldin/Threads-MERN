import { useRecoilValue } from "recoil"
import LoginCard from "../Components/LoginCard"
import SignupCard from "../Components/SignupCard"
import authScreenAtom from "../atoms/authAtom"

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom)
  return (
    <div>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</div>
  )
}
export default AuthPage
