import express from "express"
import {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile
} from "../Controllers/userController.js"
import protectRoute from "../Middlewares/protectRoute.js"

const router = express.Router()

router.get('/profile/:query', getUserProfile)
// REGISTER
router.post("/register", signupUser)
// LOGIN
router.post("/login", loginUser)
// LOGOUT
router.post("/logout", logoutUser)
router.post("/follow/:id", protectRoute, followUnfollowUser)
router.post("/update/:id", protectRoute, updateUser)

export default router
