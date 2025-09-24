import { useState, useRef } from "react";
import { API } from "../services/api"; 

export default function Recorder({ onNewNote }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    setAudioURL(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);

      try {
        const file = new File([blob], "note.webm", { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", file);

        // Send audio for transcription
        const transRes = await API.post("/api/notes/transcribe", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const transcript = transRes.data.transcript;
        await onNewNote(); // refresh notes
      } catch (error) {
        console.error("Error creating note:", error);
      }
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="p-4 border rounded-md mb-4 flex flex-col gap-2 items-center">
      <div className="flex justify-center">
        {!recording ? (
          <button
            className="px-4 py-2 w-80 rounded border"
            onClick={startRecording}
          >
            Start Recording
          </button>
        ) : (
          <button className="px-4 py-2 rounded border" onClick={stopRecording}>
            Stop Recording
          </button>
        )}
      </div>

      {audioURL && (
        <audio controls src={audioURL} className="mt-2 w-full"></audio>
      )}
    </div>
  );
}
