import Post from "../Models/postModel.js"
import User from "../Models/userModel.js"
import { v2 as cloudinary } from "cloudinary"

const createPost = async (req, res) => {
  try {
    const { text } = req.body
    let { image } = req.body
    const { _id } = req.user
    const user = await User.findById(_id)
    if (!user) return res.status(404).json({ error: "User not found" })

    if (text.length > 500)
      return res.status(400).json({ error: "Text too long" })

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image)
      image = uploadedResponse.secure_url
    }

    const newPost = await new Post({
      postedBy: user._id,
      text,
      image,
    }).save()

    res
      .status(201)
      .json({ message: "Post created successfully", newPost: newPost })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in createPost: ", error.message)
  }
}

const getPost = async (req, res) => {
  const { id } = req.params
  try {
    const post = await Post.findById(id)
    if (!post) return res.status(404).json({ error: "Post not found" })
    res.status(200).json({ message: "Post fetched successfully", post: post })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in getPost: ", error.message)
  }
}

const deletePost = async (req, res) => {
  const { id } = req.params
  try {
    const post = await Post.findById(id)
    if (!post) return res.status(404).json({ error: "Post not found" })

    if (post.postedBy.toString() !== req.user._id.toString())
      return res
        .status(401)
        .json({ message: "Unauthorized to delete the post" })

    if (post.image) {
      const imageId = post.image.split("/").slice(-1)[0].split(".")[0]
      await cloudinary.uploader.destroy(imageId)
    }

    await Post.findByIdAndDelete(id)

    res.status(200).json({ message: "Post deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in deletePost: ", error.message)
  }
}

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params
    const { _id: userId } = req.user

    const post = await Post.findById(postId)
    if (!post) return res.status(404).json({ error: "Post not found" })

    const isLiked = post.likes.includes(userId)
    if (!isLiked) {
      post.likes.push(userId)
      await post.save()
      res.status(200).json({ message: "Post liked successfully" })
    } else {
      post.likes.pull(userId)
      await post.save()
      res.status(200).json({ message: "Post unliked successfully" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in likeUnlikePost: ", error.message)
  }
}

const replyPost = async (req, res) => {
  const { id: postId } = req.params
  const { _id: userId, profilePicture, userName } = req.user
  const { text } = req.body
  try {
    if (!text) return res.status(400).json({ error: "Text is required" })

    if (text.length > 500)
      return res.status(400).json({ error: "Text too long" })

    const post = await Post.findById(postId)
    if (!post) return res.status(404).json({ error: "Post not found" })

    const reply = { userId, profilePicture, userName, text }
    console.log(reply)
    post.replies.push(reply)
    await post.save()

    res.status(200).json(reply)
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in replyPost: ", error.message)
  }
}

const feedPosts = async (req, res) => {
  // console.log(req.user)
  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: "User not found" })
    const following = user.following

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    })

    res.status(200).json({ message: "Feed fetched successfully", feedPosts })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in feedPosts: ", error.message)
  }
}

const getUserPosts = async (req, res) => {
  const { userName } = req.params
  try {
    const user = await User.findOne({ userName })
    if (!user) return res.status(404).json({ error: "User not found" })
    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    })
    res.status(200).json({ message: "Posts fetched successfully", posts })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in getUserPosts: ", error.message)
  }
}

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyPost,
  feedPosts,
  getUserPosts,
}
