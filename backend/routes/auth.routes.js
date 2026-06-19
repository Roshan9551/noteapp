import express from "express";
import upload from "../middleware/upload.middleware.js";
import { getMe, login, signup } from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", upload.single("profilePic"), signup);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;