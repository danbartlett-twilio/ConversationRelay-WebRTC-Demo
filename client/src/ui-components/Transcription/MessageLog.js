// import React from "react";
import { Avatar } from "@twilio-paste/core";
import { AgentIcon } from "@twilio-paste/icons/esm/AgentIcon";
import { ProductAutopilotIcon } from "@twilio-paste/icons/esm/ProductAutopilotIcon";

import {
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBubble,
} from "@twilio-paste/core";

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

export default function MessageLog({ events = [], showLatency = false }) {
  // Sort events by timestamp and reverse so newest comes first
  const sortedEvents = [...events].sort((a, b) => a.ts - b.ts).reverse(); // [{}, {}, {type: 'interrupt'}, ... {}]
  return (
    <ChatLog>
      {sortedEvents.map((event, index) => {
        const isTokens = event.name === "tokensPlayed";
        const isVoice = event.voicePrompt && event.type === "prompt";
        const isLatency = event.type === "latency";
        const isInterrupt = event.type === "interrupt";

        if (isTokens || isVoice) {
          const speaker = isTokens ? "bot" : "user";
          const content = isTokens ? event.value : event.voicePrompt;

          return (
            <ChatMessage
              variant={isTokens ? "inbound" : "outbound"}
              key={index}
            >
              <ChatBubble backgroundColor="red">{content}</ChatBubble>
              <ChatMessageMeta aria-label="">
                <ChatMessageMetaItem>
                  {!isTokens ? formatTime(event.ts) : <></>}
                  <Avatar
                    size="sizeIcon50"
                    name={isTokens ? "Assistant" : "User"}
                    icon={isTokens ? ProductAutopilotIcon : AgentIcon}
                    color={isTokens ? "decorative30" : "decorative20"}
                  />

                  {isTokens ? formatTime(event.ts) : <></>}
                </ChatMessageMetaItem>
              </ChatMessageMeta>
            </ChatMessage>
          );
        }

        if (isInterrupt) {
          return (
            <div key={index} className="message-container right">
              <div className="interrupt-message">Interrupted</div>
            </div>
          );
        }
        if (showLatency) {
          if (isLatency) {
            return (
              <ChatMessage variant={"inbound"} key={index}>
                <ChatBubble>Response Latency: {event.value}ms</ChatBubble>

                <ChatMessageMeta>
                  <ChatMessageMetaItem></ChatMessageMetaItem>
                </ChatMessageMeta>
              </ChatMessage>
            );
          } else {
            return null;
          }
        }

        return null;
      })}
    </ChatLog>
  );
}
