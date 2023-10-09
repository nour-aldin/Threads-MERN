import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import { v2 as cloudinary } from "cloudinary"
import userRoutes from "./Routes/userRoutes.js"
import postRoutes from "./Routes/postRoutes.js"

dotenv.config()
const app = express()

const PORT = process.env.PORT || 8000

/**
 *  cross-origin configuration
 *  prevents cross origin error and preflight error
 */
import cors from "cors"
const prodOrigins = [
  getEnvironmentVariable("ORIGIN_1"),
  getEnvironmentVariable("ORIGIN_2"),
  getEnvironmentVariable("ORIGIN_3"),
]
const devOrigin = ["http://localhost:3000"]
const allowedOrigins =
  getEnvironmentVariable("NODE_ENV") === "production" ? prodOrigins : devOrigin
app.use(
  cors({
    origin: (origin, callback) => {
      if (getEnvironmentVariable("NODE_ENV") === "production") {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error(`${origin} not allowed by cors`))
        }
      } else {
        callback(null, true)
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
)

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

app.use(express.json({ limit: "50mb" })) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // to parse form data.
app.use(cookieParser())

// ROUTES
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.get("/", (req, res) => {
  res.send("Hello World!")
})
