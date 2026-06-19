import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDb from "./config/db.js";
import authRoute from "./routes/auth.routes.js";
import noteRoute from "./routes/note.route.js";

import { connectCloudinary } from "./config/cloudinary.js";

connectDb();

// 🔥 IMPORTANT: initialize cloudinary AFTER env loads
connectCloudinary();

const app = express();

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/note", noteRoute);

app.get("/", (req, res) => {
    res.json({ message: "Noteapp running in background" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});