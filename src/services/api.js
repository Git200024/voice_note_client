import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
axios.get(`${BASE_URL}/api/notes`)
 .then(res => console.log(res.data))
  .catch(err => console.error(err));

export const fetchNotes = () => API.get("/");
export const createNote = (title, transcript) =>
  API.post("/", { title, transcript });
export const updateNote = (id, transcript) => API.put(`/${id}`, { transcript });
export const deleteNote = (id) => API.delete(`/${id}`);
export const generateSummary = (id) => API.post(`/${id}/summary`);

// transcription
export const transcribeAudio = (file) => {
  const formData = new FormData();
  formData.append("audio", file);
  return API.post("/transcribe", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
