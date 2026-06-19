import express from "express";
import upload from "../middleware/upload.middleware.js";
import { signup } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", upload.single("profilePic"), signup);

export default router;