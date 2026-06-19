import express from "express";
import { createNote, deleteNote, getNoteById, getNotes, searchNotes, searchNotesByTag, togglePinNote, updateNote } from "../controllers/note.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createNote", protect, createNote);
router.get("/getAllNotes", protect, getNotes);
router.get("/getNoteById/:id", protect, getNoteById);
router.put("/updateNote/:id", protect, updateNote);
router.delete("/deleteNote/:id", protect, deleteNote);
router.put("/toggleNote/:id", protect, togglePinNote);
router.get("/searchNote", protect, searchNotes);
router.get("/tags/:tag", protect, searchNotesByTag);

export default router;