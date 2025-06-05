// import React from "react";
import { Label } from "@twilio-paste/core";

// Helper to format time
function formatTime(ts) {
  const date = new Date(ts);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function MessageLog({ events = [] }) {
  return (
    <div className="message-log">
      <Label>Conversation Transcription</Label>

      {events.map((event, index) => {
        const isTokens = event.name === "tokensPlayed";
        const isVoice = event.voicePrompt && event.type === "prompt";
        if (!isTokens && !isVoice) return null;

        const speaker = isTokens ? "System" : "User";
        const content = isTokens ? event.value : event.voicePrompt;

        return (
          <div
            key={index}
            className={`message-container ${isTokens ? "left" : "right"}`}
          >
            <div className={`message-bubble ${isTokens ? "gray" : "blue"}`}>
              <div className="message-text">{content}</div>
              <div className="message-meta">
                {speaker} • {formatTime(event.ts)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
