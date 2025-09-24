import { useState } from "react";
import NotesList from "./pages/NotesList.jsx";
import Recorder from "./components/Recorder.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <NotesList />
    </>
  );
}

export default App;
