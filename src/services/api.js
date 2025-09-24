import axios from "axios";


const BASE_URL = import.meta.env.VITE_BACKEND_URL;


export const API = axios.create({
  baseURL: BASE_URL,
});

// Notes API 
export const fetchNotes = () => API.get("/api/notes");
export const createNote = (title, transcript) =>
  API.post("/api/notes", { title, transcript });
export const updateNote = (id, transcript) =>
  API.put(`/api/notes/${id}`, { transcript });
export const deleteNote = (id) => API.delete(`/api/notes/${id}`);
export const generateSummary = (id) =>
  API.post(`/api/notes/${id}/summary`);

// Transcription
export const transcribeAudio = (file) => {
  const formData = new FormData();
  formData.append("audio", file);
  return API.post("/api/notes/transcribe", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
