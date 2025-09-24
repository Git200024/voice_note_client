import { useEffect, useState } from "react";
import Recorder from "../components/Recorder";
import Note from "../components/Note";
import { API } from "../services/api"; 

export default function NotesList() {
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    try {
      const res = await API.get("/api/notes");

      setNotes(
        res.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Notes</h1>

      <Recorder onNewNote={loadNotes} />

      {notes.length === 0 ? (
        <p>No notes yet</p>
      ) : (
        notes.map((note) => (
          <Note key={note._id} note={note} onRefresh={loadNotes} />
        ))
      )}
    </div>
  );
}
