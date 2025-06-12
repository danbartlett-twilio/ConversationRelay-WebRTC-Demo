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

// Helper to reposition interrupt event
function repositionInterrupts(events) {
  const reordered = [];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (event.type === "interrupt") {
      // Find matching tokensPlayed
      const matchIndex = events.findIndex(
        (e, j) =>
          j > i && // must come after the interrupt
          e.name === "tokensPlayed" &&
          e.ts === event.ts &&
          e.value === event.utteranceUntilInterrupt
      );

      if (matchIndex !== -1) {
        // Push tokensPlayed first, then interrupt after it
        for (let j = 0; j < events.length; j++) {
          if (j === matchIndex) {
            reordered.push(events[j]); // tokensPlayed
            reordered.push(event); // interrupt
          } else if (j !== i) {
            reordered.push(events[j]);
          }
        }

        return reordered; // Early return, only handling one interrupt
      }
    }
  }

  return events; // No reordering needed
}

export default function MessageLog({ events = [] }) {
  // Sort events by timestamp and reverse so newest comes first
  const sortedEvents = [...events].sort((a, b) => a.ts - b.ts).reverse(); // [{}, {}, {type: 'interrupt'}, ... {}]
  // const repositionedEvents = repositionInterrupts(sortedEvents);

  // rather than repositioning or having separarte interrupt do we want to just put interrupt next to the previous message?

  return (
    <div className="message-log">
      {sortedEvents.map((event, index) => {
        const isTokens = event.name === "tokensPlayed";
        const isVoice = event.voicePrompt && event.type === "prompt";
        const isLatency = event.type === "latency";
        const isInterrupt = event.type === "interrupt";

        if (isTokens || isVoice) {
          const speaker = isTokens ? "System" : "User";
          const content = isTokens ? event.value : event.voicePrompt;

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

              <div
                className={`message-bubble ${isTokens ? "remote" : "local"}`}
              >
                <div className="message-text">{content}</div>
                <div className="message-meta">{formatTime(event.ts)}</div>
              </div>
            </div>
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
            <div key={index} className="message-container left">
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
            </div>
          );
        }

        // if (isInterrupt) {
        //   return (
        //     <div key={index} className="interrupt-container">
        //       <div className="interrupt-message">
        //         Interrupted
        //         {/* Interrupted {event.durationUntilInterruptMs}ms */}
        //         <br />
        //       </div>
        //     </div>
        //   );
        // }

        return null;
      })}
    </div>
  );
}
