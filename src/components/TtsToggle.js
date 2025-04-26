// src/components/TtsToggle.js
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useTts } from "../context/TtsContext";

const TtsToggle = () => {
  const { ttsMode, setTtsMode } = useTts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/settings/tts-mode")
      .then((res) => {
        setTtsMode(res.data.ttsMode || "native");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch TTS mode", err);
        setLoading(false);
      });
  }, [setTtsMode]);

  const handleChange = (e) => {
    const selected = e.target.value;
    setTtsMode(selected); // Update context

    axios
      .put("/settings/tts-mode", { ttsMode: selected })
      .then(() => console.log("✅ TTS mode updated to:", selected))
      .catch((err) => console.error("❌ Failed to update TTS mode", err));
  };

  if (loading) return <p>Loading TTS settings...</p>;

  return (
    <div className="mb-3" style={{ maxWidth: "300px" }}>
      <label className="form-label fw-bold">Text-to-Speech Mode:</label>
      <select className="form-select" value={ttsMode} onChange={handleChange}>
        <option value="native">🌐 Native (Browser-based)</option>
        <option value="elevenlabs">🧠 ElevenLabs (AI Voice)</option>
      </select>
      <small className="text-muted">
        This will determine which voice engine the SmartBot uses.
      </small>
    </div>
  );
};

export default TtsToggle;
