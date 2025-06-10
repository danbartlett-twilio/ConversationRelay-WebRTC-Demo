// import React from "react";
import { Avatar, AvatarGroup, Stack } from "@twilio-paste/core";
import botImage from "../images/bot.png";
import { AgentIcon } from "@twilio-paste/icons/esm/AgentIcon";

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
  // Sort events by timestamp and reverse so newest comes first
  const sortedEvents = [...events].sort((a, b) => a.ts - b.ts).reverse();

  return (
    <div className="message-log">
      {sortedEvents.map((event, index) => {
        const isTokens = event.name === "tokensPlayed";
        const isVoice = event.voicePrompt && event.type === "prompt";
        if (!isTokens && !isVoice) return null;

        const speaker = isTokens ? "System" : "User";
        const content = isTokens ? event.value : event.voicePrompt;

        // return (
        //   <div
        //     key={index}
        //     className={`message-container ${isTokens ? "left" : "right"}`}
        //   >
        //     <div className={`message-bubble ${isTokens ? "remote" : "local"}`}>
        //       <div className="message-text">{content}</div>
        //       <div className="message-meta">
        //         {/* <Avatar
        //           // size="sizeIcon110"
        //           name="Conversation Relay Avatar"
        //           src={botImage}
        //           color="decorative30"
        //         /> */}
        //         {/* <Avatar
        //           size="sizeIcon110"
        //           name="User Avatar"
        //           icon={AgentIcon}
        //           color="decorative20"
        //         /> */}
        //         {speaker} • {formatTime(event.ts)}
        //       </div>
        //     </div>
        //   </div>
        // );

        return (
          <div
            key={index}
            className={`message-container ${isTokens ? "left" : "right"}`}
          >
            <div className="message-avatar">
              {isTokens ? (
                <Avatar
                  size="sizeIcon40"
                  name="System"
                  src={botImage}
                  color="decorative30"
                />
              ) : (
                <Avatar
                  size="sizeIcon40"
                  name="User"
                  icon={AgentIcon}
                  color="decorative20"
                />
              )}
            </div>

            <div className={`message-bubble ${isTokens ? "remote" : "local"}`}>
              <div className="message-text">{content}</div>
              <div className="message-meta">{formatTime(event.ts)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
