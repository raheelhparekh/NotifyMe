import express from "express"
import { createTestUser } from "../controllers/user.controllers.js";

const userRoutes=express.Router()

userRoutes.post("/create-test-user", createTestUser)

export default userRoutes