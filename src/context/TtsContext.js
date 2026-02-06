import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// Get WebSocket base URL from environment variable
const WS_BASE_URL =
  process.env.REACT_APP_WS_BASE_URL || "http://localhost:8081";
const TtsContext = createContext();

export const useTts = () => useContext(TtsContext);

export const TtsProvider = ({ children }) => {
  const [ttsMode, setTtsMode] = useState("native");

  // Fetch initial TTS mode
  useEffect(() => {
    axios
      .get("/settings/tts-mode")
      .then((res) => {
        setTtsMode(res.data.ttsMode || "native");
      })
      .catch((err) => {
        console.error("Failed to fetch TTS mode", err);
      });
  }, []);

  // Setup WebSocket for real-time updates
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
      reconnectDelay: 5000,
      // reconnectDelay: 0,

      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        client.subscribe("/topic/tts-mode", (msg) => {
          const updatedMode = msg.body;
          console.log("🔁 TTS mode updated via WebSocket:", updatedMode);
          setTtsMode(updatedMode);
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame.headers["message"]);
        console.error("Details:", frame.body);
      },
    });

    client.activate();

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, []);

  return (
    <TtsContext.Provider value={{ ttsMode, setTtsMode }}>
      {children}
    </TtsContext.Provider>
  );
};
