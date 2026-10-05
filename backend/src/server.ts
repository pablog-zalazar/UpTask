import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import { connectDB } from "./config/db"
import { router as projectRoutes } from "./routes/projectRoutes"
import { router as authRoutes } from "./routes/authRoutes"
import { corsConfig } from "./config/cors"

dotenv.config()
connectDB()

export const server = express()

// Loggin
server.use(morgan("dev"))

server.use(express.json())
server.use(cors(corsConfig))

// Routes
server.use("/api/projects", projectRoutes)
server.use("/api/auth", authRoutes)