// import React from "react";
import { Avatar } from "@twilio-paste/core";
import botImage from "../../images/bot.png"; // Red bot image
import { AgentIcon } from "@twilio-paste/icons/esm/AgentIcon";
import { ProductAutopilotIcon } from "@twilio-paste/icons/esm/ProductAutopilotIcon";

import {
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBubble,
  AIChatLog,
  AIChatMessage,
  AIChatMessageBody,
  AIChatMessageAuthor,
  AIChatMessageActionGroup,
  AIChatMessageActionCard,
  AIChatMessageLoading,
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

export default function MessageLog({ events = [] }) {
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
                    color={isTokens ? "decorative20" : "decorative40"}
                  />

                  {isTokens ? formatTime(event.ts) : <></>}
                </ChatMessageMetaItem>
              </ChatMessageMeta>
            </ChatMessage>

            // <AIChatLog variant={speaker} key={index}>
            //   <AIChatMessage variant={speaker}>
            //     <AIChatMessageAuthor
            //       avatarIcon={
            //         speaker === "bot" ? ProductAutopilotIcon : AgentIcon
            //       }
            //       //   avatarSrc={botImage}
            //       aria-label={speaker === "bot" ? "AI Said" : "You Said"}
            //     >
            //       {isTokens ? "Conversation Relay" : "User"}
            //     </AIChatMessageAuthor>

            //     <AIChatMessageBody>{content}</AIChatMessageBody>
            //     {formatTime(event.ts)}
            //   </AIChatMessage>
            // </AIChatLog>
          );
        }

        if (isInterrupt) {
          return (
            <div key={index} className="message-container right">
              <div className="interrupt-message">Interrupted</div>
            </div>
          );
        }

        if (isLatency) {
          return (
            <ChatMessage variant={"inbound"} key={index}>
              <ChatBubble backgroundColor="red">
                Response Latency: {event.value}ms
              </ChatBubble>
              <ChatMessageMeta aria-label="">
                <ChatMessageMetaItem>
                  <Avatar
                    size="sizeIcon50"
                    name={"Assistant"}
                    icon={ProductAutopilotIcon}
                    color={"decorative20"}
                  />
                </ChatMessageMetaItem>
              </ChatMessageMeta>

              {/* <div key={index} className="message-container left">
                <div className="message-avatar">
                  <Avatar
                    size="sizeIcon40"
                    name="System"
                    src={botImage}
                    color="decorative30"
                  />
                </div>

                <div className="latency-text">
                  Response Latency: {event.value}ms
                </div>
              </div> */}
            </ChatMessage>
          );
        }

        return null;
      })}
    </ChatLog>
  );
}
