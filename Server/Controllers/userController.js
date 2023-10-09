import User from "../Models/userModel.js"
import Post from "../Models/postModel.js"
import bcrypt from "bcrypt"
import generateTokenAndSetCookie from "../Helpers/generateTokenAndSetCookie.js"
import { v2 as cloudinary } from "cloudinary"
import mongoose from "mongoose"

const signupUser = async (req, res) => {
  try {
    const { name, email, password, userName } = req.body
    const duplicateInfo = await User.findOne({ $or: [{ email }, { userName }] })
    if (duplicateInfo) {
      return res.status(400).json({ error: "Email or username already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name,
      userName,
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    await newUser.save()

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res)

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        userName: newUser.userName,
        email: newUser.email,
        bio: newUser.bio,
        profilePicture: newUser.profilePicture,
      })
    } else {
      res.status(400).json({ error: "Invalid user data" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in signupUser: ", error.message)
  }
}

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body

    const user = await User.findOne({ userName })
    if (!user) return res.status(400).json({ error: "Invalid username" })

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" })

    generateTokenAndSetCookie(user._id, res)

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      userName: user.userName,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in signinUser: ", error.message)
  }
}

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 })
    res.status(200).json({ message: "User logged out" })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in logoutUser: ", error.message)
  }
}

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params
    const userToModify = await User.findById(id)
    const currentUser = await User.findById(req.user._id)

    if (id == req.user._id)
      return res.status(400).json({ error: "You cannot follow yourself" })

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" })

    const following = currentUser.following.includes(id)

    if (following) {
      currentUser.following.pull(id)
      userToModify.followers.pull(req.user._id)
      res.status(200).json({ message: "User unfollowed" })
    } else {
      currentUser.following.push(id)
      userToModify.followers.push(req.user._id)
      res.status(200).json({ message: "User followed" })
    }

    await currentUser.save()
    await userToModify.save()
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in followUnFollowUser: ", error.message)
  }
}

const updateUser = async (req, res) => {
  const { name, email, userName, password, bio } = req.body
  let { profilePicture } = req.body
  const userId = req.user._id
  try {
    let user = await User.findById(userId)
    if (!user) return res.status(400).json({ error: "User not found" })

    if (req.params.id !== userId.toString())
      return res
        .status(401)
        .json({ error: "You can only update your own profile" })

    if (password) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      user.password = hashedPassword
    }

    if (profilePicture) {
      if (user.profilePicture) {
        await cloudinary.uploader.destroy(
          user.profilePicture.split("/").pop().split(".")[0]
        )
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePicture)
      user.profilePicture = uploadedResponse.secure_url
    }

    user.name = name || user.name
    user.email = email || user.email
    user.userName = userName || user.userName
    user.profilePicture = profilePicture || user.profilePicture
    user.bio = bio || user.bio

    user = await user.save()

    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].userName": user.userName,
          "replies.$[reply].userProfilePicture": user.profilePicture,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    )

    user.password = null
    res.status(200).json({ message: "User Updated Successfully", user: user })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in updateUser: ", error.message)
  }
}

const getUserProfile = async (req, res) => {
  const { query } = req.params
  try {
    let user
    //if query is an id
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt")
    } else {
      //query is username
      user = await User.findOne({ userName: query })
        .select("-password")
        .select("-updatedAt")
    }

    if (!user) return res.status(400).json({ error: "User not found" })
    res.status(200).json({ message: "User found successfully", user: user })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in getUserProfile: ", error.message)
  }
}

const geSuggetedUsers = async (req, res) => {
  try {
    const userId = req.user._id
    const usersFollowedByYou = await User.findById(userId).select("following")

    const users = await User.aggregate([
      { $match: { _id: { $ne: userId } } },
      { $sample: { size: 10 } },
    ])
    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    )
    const suggetedUsers = filteredUsers.slice(0, 4)

    suggetedUsers.forEach((user) => (user.password = null))

    res
      .status(200)
      .json({ message: "Suggeted users found", users: suggetedUsers })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in geSuggetedUsers: ", error.message)
  }
}

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  geSuggetedUsers,
}
