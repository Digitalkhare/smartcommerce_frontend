import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "../api/axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./Chatbot.css";
import { useAuth } from "../auth/AuthContext";
import { useTts } from "../context/TtsContext";

const Chatbot = () => {
  const { user } = useAuth();
  const { ttsMode } = useTts();
  const audioRef = useRef(null);

  const [userProfile, setUserProfile] = useState(null);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFirefox, setIsFirefox] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (open && user && !hasGreeted) {
      axios
        .get("/auth/me")
        .then((res) => {
          setUserProfile(res.data);
          const fullName = [res.data.firstName, res.data.lastName]
            .filter(Boolean)
            .join(" ");
          const greeting = `Hello ${fullName}! I’m Jessica, your smart shopping assistant. How can I help today?`;
          setMessages((prev) => [...prev, { sender: "bot", text: greeting }]);
          speak(greeting);
          setHasGreeted(true);
        })
        .catch(() => {
          const fallback =
            "Hello! I’m your smart shopping assistant. How can I help today?";
          setMessages((prev) => [...prev, { sender: "bot", text: fallback }]);
          speak(fallback);
          setHasGreeted(true);
        });
    }
  }, [open, user, hasGreeted]);

  useEffect(() => {
    if (user) {
      setMessages([]);
      setHasGreeted(false);
      setUserProfile(null);
    }
  }, [user?.sub, user]);
  const speak = useCallback(
    (text) => {
      if (ttsMode === "elevenlabs") {
        speakWithElevenLabs(text);
      } else {
        speakWithNativeVoice(text);
      }
    },
    [ttsMode]
  );

  const handleSend = useCallback(
    async (message = input) => {
      if (!message.trim()) return;

      setMessages((prev) => [...prev, { sender: "user", text: message }]);
      setInput("");
      setIsBotTyping(true);

      try {
        const chatRes = await axios.post("/chat", { message });
        const reply = chatRes.data.reply;
        setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
        setIsBotTyping(false);
        speak(reply);
      } catch (err) {
        console.error(err);
        setIsBotTyping(false);
      }
    },
    [input, speak]
  );

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const isFF = navigator.userAgent.toLowerCase().includes("firefox");
      setIsFirefox(isFF);
    }
  }, []);

  useEffect(() => {
    if (transcript && !listening) {
      handleSend(transcript);
      resetTranscript();
    }
  }, [listening, transcript, handleSend, resetTranscript]);

  const loadVoices = () => {
    return new Promise((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) return resolve(voices);

      const onVoicesChanged = () => {
        const loadedVoices = speechSynthesis.getVoices();
        speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
        resolve(loadedVoices);
      };

      speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    });
  };

  const speakWithNativeVoice = async (text) => {
    setIsSpeaking(true);
    speechSynthesis.cancel();

    const voices = await loadVoices();
    const preferredVoice = voices.find((v) => v.name.includes("Hazel"));

    const utterance = new SpeechSynthesisUtterance(text);
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      console.log("✅ Native TTS ended");
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error("❌ Native TTS error", e);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const speakWithElevenLabs = async (text) => {
    setIsSpeaking(true);

    try {
      const res = await axios.post(
        "/tts",
        { text },
        { responseType: "arraybuffer" }
      );
      const blob = new Blob([res.data], { type: "audio/mpeg" });
      const blobUrl = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(blobUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(blobUrl);
      };

      audio.onerror = (e) => {
        console.error("❌ Audio error", e);
        setIsSpeaking(false);
        URL.revokeObjectURL(blobUrl);
      };

      audio.play().catch((err) => {
        console.error("🎧 Playback error:", err);
        setIsSpeaking(false);
      });
    } catch (err) {
      console.error("TTS failed", err);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
  }, [ttsMode]);

  const handleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: false });
    }
  };

  const showMic = browserSupportsSpeechRecognition && !isFirefox;

  return (
    <>
      <div className={`chatbot-popup ${open ? "open" : ""}`}>
        <div className="chatbot-header d-flex justify-content-between align-items-center">
          <strong>🧠 SmartBot</strong>
          <button className="btn-close" onClick={() => setOpen(false)}></button>
        </div>

        <div className="chatbot-body">
          <div className="chat-window">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                <strong>{msg.sender === "bot" ? "Bot" : "You"}:</strong>{" "}
                {msg.text}
              </div>
            ))}
            {listening && <div className="waveform">🎤 Listening...</div>}
          </div>

          {!browserSupportsSpeechRecognition && (
            <div className="alert alert-warning small mt-2">
              ⚠️ Voice input isn't supported in Firefox. Try using Chrome or
              Edge for full SmartBot experience.
            </div>
          )}

          <div className="chat-controls d-flex gap-2 mt-2">
            <input
              className="form-control"
              value={input}
              placeholder="Type or speak..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="btn btn-success" onClick={() => handleSend()}>
              Send
            </button>
            {showMic && (
              <button
                className={`btn btn-${listening ? "danger" : "info"}`}
                onClick={handleMic}
                disabled={isSpeaking}
              >
                {listening ? "Stop" : "🎙️"}
              </button>
            )}
          </div>

          {isBotTyping && (
            <div className="chat-msg bot typing-indicator">
              <strong>Bot typing:</strong>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="chatbot-toggle" onClick={() => setOpen(true)}>
        💬
      </div>
    </>
  );
};

export default Chatbot;
