import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import { v2 as cloudinary } from "cloudinary"
import userRoutes from "./Routes/userRoutes.js"
import postRoutes from "./Routes/postRoutes.js"
import cors from "cors"

dotenv.config()
const app = express()

const PORT = process.env.PORT || 8000

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })

app.use(cors()) // Enable CORS for all routes.
app.use(express.json({ limit: "50mb" })) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // to parse form data.
app.use(cookieParser())

// ROUTES
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.get("/", (req, res) => {
  res.send("Hello World!")
})
