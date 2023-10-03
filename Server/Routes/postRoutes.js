import express from "express"
import {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyPost,
  feedPosts,
  getUserPosts,
} from "../Controllers/postController.js"
import protectRoute from "../Middlewares/protectRoute.js"

const router = express.Router()

router.get("/feed", protectRoute, feedPosts)
router.post("/create", protectRoute, createPost)
router.get("/:id", getPost)
router.get("/user/:userName", getUserPosts)
router.delete("/:id", protectRoute, deletePost)
router.put("/like/:id", protectRoute, likeUnlikePost)
router.put("/reply/:id", protectRoute, replyPost)
export default router
