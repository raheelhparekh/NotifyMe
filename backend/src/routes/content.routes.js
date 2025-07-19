import express from "express"
import { createTestContent } from "../controllers/content.controllers.js";

const contentRoutes=express.Router()

contentRoutes.post("/create-test-content", createTestContent)

export default contentRoutes