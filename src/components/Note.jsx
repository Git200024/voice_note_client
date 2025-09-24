import { useState, useEffect } from "react";
import axios from "axios";

export default function Note({ note, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [transcript, setTranscript] = useState(note.transcript);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    setTranscript(note.transcript);
  }, [note.transcript]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/notes/${note._id}`, {
        transcript,
      });
      setEditing(false);
      onRefresh();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/notes/${note._id}/summary`
      );
      if (res.data.summary) {
        note.summary = res.data.summary;
      }
      onRefresh();
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${note._id}`);
      onRefresh();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="border p-4 rounded-md mb-2">
      <p className="text-sm text-gray-500 mt-1">
        {new Date(note.createdAt).toLocaleString()}
      </p>

      {editing ? (
        <textarea
          className="border p-2 w-full mt-2 rounded"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
      ) : (
        <p className="mt-2">{transcript}</p>
      )}

      {note.summary && (
        <div className="mt-2 p-2 rounded">
          <strong>Summary:</strong> {note.summary}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-2">
        {editing ? (
          <button className="px-3 py-1 rounded border" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button
            className="px-3 py-1 rounded border"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        )}

        <button className="px-3 py-1 rounded border" onClick={handleDelete}>
          Delete
        </button>

        {!note.summary && (
          <button
            className={`px-3 py-1 rounded border ${
              summaryLoading ? "opacity-50" : ""
            }`}
            disabled={summaryLoading}
            onClick={handleGenerateSummary}
          >
            {summaryLoading ? "Generating..." : "Generate Summary"}
          </button>
        )}
      </div>
    </div>
  );
}
