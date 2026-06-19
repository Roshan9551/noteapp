import { Note } from "../models/note.model.js";

export const createNote = async (req, res) => {
    try{
        const { title, content, tags } = req.body;
      
        // Validate inputs
        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        // create note
        const note = await Note.create({
            title: title.trim(),
            content: content.trim(),
            tags, 
            owner: req.user._id
        });

        return res.status(200).json({
            message: "Note created successfully",
            note
        });
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getNotes = async (req, res) => {
    try{
        const notes = await Note.find({ owner: req.user._id });

        return res.status(200).json({
            message: "Notes fetched successfully",
            count: notes.length,
            notes
        });
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getNoteById = async (req, res) => {
    try{
        const note = await Note.findById(req.params.id);

        if(!note){
            return res.status(404).json({ message: "Note not found" });
        }

        // check if the note belongs to logged in user
        if(note.owner.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Access denied" });
        }

        return res.status(200).json({
            message: "Note fetched successfully",
            note
        });
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const updateNote = async (req, res) => {
    try{
        const { title, content, tags } = req.body;
        // Validate inputs
        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).json({ message: "Note not found" });
        }

        if(note.owner.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Access denied" })
        }

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                tags
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            message: "Note updated successfully",
            note: updatedNote
        });
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const deleteNote = async (req, res) => {
    try{
        const note = await Note.findById(req.params.id);

        if(!note){
            return res.status(404).json({ message: "Note not found" });
        }

        if(note.owner.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Access denied" })
        }

        await Note.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: "Note deleted successfully" });
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const togglePinNote = async (req, res) => {
    try{
        const note = await Note.findById(req.params.id);

        if(!note){
            return res.status(404).json({ message: "Note not found" });
        }

        if(note.owner.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Access denied" })
        }

        note.isPinned = !note.isPinned;

        await note.save();

        return res.status(200).json({
            message: `Note ${note.isPinned ? "pinned" : "unpinned"} successfully`,
            note
        });
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const searchNotes = async (req, res) => {
    try{
        const { q } = req.query;

         if (!q) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const notes = await Note.find({
            owner: req.user._id,
            $or: [
                { title: { $regex: q, $options: "i" } },
                { content: { $regex: q, $options: "i" } }
            ]
        }).sort({ isPinned: -1, createdAt: -1 });

        return res.status(200).json({
            count: notes.length,
            notes
        });
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const searchNotesByTag = async (req, res) => {
    try{
        const { tag } = req.params;

        const notes = await Note.find({
            owner: req.user._id,
            tags: tag
        }).sort({ isPinned: -1, createdAt: -1 });

        return res.status(200).json({
            count: notes.length,
            notes
        });
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}