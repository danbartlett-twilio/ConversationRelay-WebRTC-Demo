// import React from "react";
import { Avatar } from "@twilio-paste/core";

import {
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBubble,
} from "@twilio-paste/core";

import { AgentIcon } from "@twilio-paste/icons/esm/AgentIcon";
import { ProductAutopilotIcon } from "@twilio-paste/icons/esm/ProductAutopilotIcon";

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
  const sortedEvents = [...events].sort(
    (a, b) => a.value.timestamp - b.value.timestamp
  );

  return (
    <ChatLog>
      {sortedEvents.map((event, index) => {
        let isTokens = false;
        if (event.value.role === "assistant" || event.value.role === "tool") {
          isTokens = true;
        }
        // Do not display messsages with empty content (tool calls)
        if (event.value.content === "") {
          return;
        }
        // Avoid display of "system" messages
        if (event.value.role === "system") {
          return;
        }
        // pull out content from tool calls
        let content = event.value.content;
        if (content.includes('"message":')) {
          content = JSON.parse(content).message;
        }

        return (
          <ChatMessage variant={isTokens ? "inbound" : "outbound"} key={index}>
            <ChatBubble backgroundColor="red">{content}</ChatBubble>
            <ChatMessageMeta aria-label="">
              <ChatMessageMetaItem>
                {!isTokens ? formatTime(event.value.timestamp) : <></>}
                <Avatar
                  size="sizeIcon50"
                  name={isTokens ? "Assistant" : "User"}
                  icon={isTokens ? ProductAutopilotIcon : AgentIcon}
                  color={isTokens ? "decorative30" : "decorative20"}
                />
                {isTokens ? formatTime(event.value.timestamp) : <></>}
              </ChatMessageMetaItem>
            </ChatMessageMeta>
          </ChatMessage>
        );
      })}
    </ChatLog>
  );
}
