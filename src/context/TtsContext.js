import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

const TtsContext = createContext();

export const useTts = () => useContext(TtsContext);

export const TtsProvider = ({ children }) => {
  const [ttsMode, setTtsMode] = useState("native");

  useEffect(() => {
    const fetchMode = () => {
      axios
        .get("/settings/tts-mode")
        .then((res) => {
          if (res.data.ttsMode && res.data.ttsMode !== ttsMode) {
            setTtsMode(res.data.ttsMode);
            console.log("🔁 TTS mode refreshed:", res.data.ttsMode);
          }
        })
        .catch((err) => {
          console.error("Failed to load TTS mode", err);
        });
    };

    fetchMode(); // Initial fetch on mount

    const interval = setInterval(fetchMode, 10000); // Refresh every 10 sec

    return () => clearInterval(interval); // Clean up on unmount
  }, [ttsMode]);

  return (
    <TtsContext.Provider value={{ ttsMode, setTtsMode }}>
      {children}
    </TtsContext.Provider>
  );
};
