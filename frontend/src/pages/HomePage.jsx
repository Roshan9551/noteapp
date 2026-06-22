import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, LogOut, Pin, Pencil, Trash2, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import useAuthStore from "@/store/useAuthStore";
import axiosInstance from "@/lib/axios";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "", tags: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get("/note/getAllNotes");
      setNotes(res.data.notes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const openNewNote = () => {
    setEditingNote(null);
    setFormData({ title: "", content: "", tags: "" });
    setError("");
    setModalOpen(true);
  };

  const openEditNote = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags?.join(", ") || "",
    });
    setError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      setError("Title and content are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      if (editingNote) {
        await axiosInstance.put(`/note/updateNote/${editingNote._id}`, payload);
      } else {
        await axiosInstance.post("/note/createNote", payload);
      }
      setModalOpen(false);
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (note) => {
    setDeletingNote(note);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/note/deleteNote/${deletingNote._id}`);
      setDeleteModalOpen(false);
      setDeletingNote(null);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePin = async (id) => {
    try {
      await axiosInstance.put(`/note/toggleNote/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredNotes = notes
    .filter((n) => {
      if (activeTag && !n.tags?.includes(activeTag)) return false;
      if (search) {
        const q = search.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => b.isPinned - a.isPinned);

  const allTags = [...new Set(notes.flatMap((n) => n.tags || []))];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nota.</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Hi, {user?.name}</span>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Search and New Note */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={openNewNote}>
            <Plus className="w-4 h-4 mr-2" />
            New note
          </Button>
        </div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={activeTag === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveTag(null)}
            >
              All
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={activeTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Skeleton className="h-3 w-16" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="text-muted-foreground">No notes found.</p>
            <Button onClick={openNewNote}>
              <Plus className="w-4 h-4 mr-2" />
              Create your first note
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow bg-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-base leading-tight">{note.title}</h3>
                  <button
                    onClick={() => handlePin(note._id)}
                    className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                  >
                    {note.isPinned ? (
                      <Pin className="w-4 h-4 fill-current" />
                    ) : (
                      <PinOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                {note.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditNote(note)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(note)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Note Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit note" : "New note"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input
                placeholder="Note title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Write your note..."
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tags (comma separated)</Label>
              <Input
                placeholder="e.g. work, personal, ideas"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingNote ? "Save changes" : "Create note"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete note?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              "{deletingNote?.title}"
            </span>
            ? This cannot be undone.
          </p>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;