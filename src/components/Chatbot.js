import React, { useState, useEffect, useCallback } from "react";
//import axios from "axios";
import axios from "../api/axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./Chatbot.css"; // optional for animations
import { useAuth } from "../auth/AuthContext";

const Chatbot = () => {
  const { user } = useAuth(); // or props.user or global store
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

  const [messages, setMessages] = useState([
    // {
    //   sender: "bot",
    //   text: "Hello! I’m your smart shopping assistant. How can I help today?",
    // },
  ]);
  //   useEffect(() => {
  //     if (open && user) {
  //       axios
  //         .get("/auth/me")
  //         .then((res) => setUserProfile(res.data))
  //         .catch((err) => {
  //           console.error("Failed to load user profile", err);
  //         });
  //     }
  //   }, [open, user]);
  useEffect(() => {
    if (open && user && !hasGreeted) {
      axios
        .get("/auth/me")
        .then((res) => {
          setUserProfile(res.data);

          const fullName = [res.data.firstName, res.data.lastName]
            .filter(Boolean)
            .join(" ");

          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: `Hello ${fullName}! I’m Jessica, your smart shopping assistant. How can I help today?`,
            },
          ]);

          setHasGreeted(true);
        })
        .catch((err) => {
          console.error("Failed to load user profile", err);

          // Fallback greeting
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Hello! I’m your smart shopping assistant. How can I help today?",
            },
          ]);

          setHasGreeted(true);
        });
    }
  }, [open, user, hasGreeted]);

  useEffect(() => {
    // When a new user logs in, clear previous state
    if (user) {
      setMessages([]);
      setHasGreeted(false);
      setUserProfile(null);
    }
  }, [user?.sub, user]); // Depend on user's unique ID or email

  //   useEffect(() => {
  //     if (!hasGreeted && open) {
  //       if (userProfile) {
  //         setMessages((prev) => [
  //           ...prev,
  //           {
  //             sender: "bot",
  //             text: `Hello ${[userProfile.firstName, userProfile.lastName]
  //               .filter(Boolean)
  //               .join(
  //                 " "
  //               )}! I’m your smart shopping assistant. How can I help today?`,
  //           },
  //         ]);
  //       } else if (!user) {
  //         setMessages((prev) => [
  //           ...prev,
  //           {
  //             sender: "bot",
  //             text: "Hello! I’m your smart shopping assistant. How can I help today?",
  //           },
  //         ]);
  //       }
  //       setHasGreeted(true);
  //     }
  //   }, [user, userProfile, open, hasGreeted]);

  //   const handleSend = useCallback(
  //     async (message = input) => {
  //       if (!message.trim()) return;

  //       setMessages((prev) => [...prev, { sender: "user", text: message }]);
  //       setInput("");
  //       try {
  //         const chatRes = await axios.post("/chat", { message });
  //         const reply = chatRes.data.reply;
  //         setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
  //         speak(reply);
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     },
  //     [input]
  //   );
  const handleSend = useCallback(
    async (message = input) => {
      if (!message.trim()) return;

      setMessages((prev) => [...prev, { sender: "user", text: message }]);
      setInput("");
      setIsBotTyping(true); // Show typing indicator

      try {
        const chatRes = await axios.post("/chat", { message });
        const reply = chatRes.data.reply;

        // 👇 Dynamic delay based on message length (capped to 5s)
        const delay = Math.min(reply.length * 30, 5000);

        setTimeout(() => {
          setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
          setIsBotTyping(false);
          speak(reply);
        }, delay);
      } catch (err) {
        setIsBotTyping(false);
        console.error(err);
      }
    },
    [input]
  );

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const isFF = navigator.userAgent.toLowerCase().includes("firefox");
      console.log("isFirefox:", isFF);
      setIsFirefox(navigator.userAgent.toLowerCase().includes("firefox"));
    }
  }, []);
  useEffect(() => {
    if (transcript && !listening) {
      handleSend(transcript);
      resetTranscript();
    }
  }, [listening, transcript, handleSend, resetTranscript]);

  useEffect(() => {
    if (isFirefox && open) {
      console.log("✅ Rendering Firefox warning!");
    }
  }, [isFirefox, open]);

  const speak = (text) => {
    setIsSpeaking(true);
    axios
      .post("/tts", { text }, { responseType: "arraybuffer" })
      .then((res) => {
        const blob = new Blob([res.data], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      })
      .catch(() => {
        setIsSpeaking(false);
      });
  };

  const handleMic = () => {
    if (listening) SpeechRecognition.stopListening();
    else SpeechRecognition.startListening({ continuous: false });
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
