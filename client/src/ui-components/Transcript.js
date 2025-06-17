import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Stack, Heading, Card } from "@twilio-paste/core";

import MessageLog from "./MessageLog";
import "../styles/MessageLog.css"; // Import the CSS styles

const Transcript = forwardRef((props, ref) => {
  const [socket, setSocket] = useState(null);
  const textLog = useRef(null);

  const [events, setEvents] = useState([]);

  // Invoke Websocket from Main
  useImperativeHandle(ref, () => ({
    invokeSetupWebsockToController() {
      setupWebsockToController();
    },
    invokeCloseWebsockToController() {
      closeWebsockToController();
      console.log("Websocket connection closed");
    },
  }));

  const setupWebsockToController = async () => {
    // For developing use this url to get events without having to re-build
    // TO DO - update this socket
    console.log("registering socket");
    const socket = new WebSocket(
      "ws://localhost:3000/?callSid=" + props.identity
    );
    // const socket = new WebSocket("/?callSid=" + props.identity);
    setSocket(socket);
    // Reset events
    setEvents([]);

    // Connection opened
    socket.addEventListener("open", (event) => {
      socket.send(JSON.stringify({ message: "Connection established" }));
      console.log("Connection opened!");
    });

    let clientTs = 0;
    let agentTs = 0;
    let latency;

    // Listen for messages
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      // console.log(data);

      if (data.type === "info" && data.name !== "tokensPlayed") {
        if (data.name === "clientSpeaking" && data.value === "off") {
          clientTs = data.ts;
        }
        if (data.name === "agentSpeaking" && data.value === "on") {
          agentTs = data.ts;
        }

        // latency is the total time in ms for agent to start speaking after client stops speaking
        latency = agentTs - clientTs;

        if (
          latency > 0 &&
          clientTs > 0 &&
          data.name === "agentSpeaking" &&
          data.value === "on"
        ) {
          console.log(`latency is ${latency}ms`);
          setEvents((prevEvents) => [
            ...prevEvents,
            { type: "latency", value: latency },
          ]);
        }
      }

      if (data.type === "interrupt") {
        setEvents((prevEvents) => [...prevEvents, data]);
      }

      if (data.type === "info" && data.name === "tokensPlayed") {
        setEvents((prevEvents) => [...prevEvents, data]);
      }

      if (data.type === "prompt") {
        setEvents((prevEvents) => [...prevEvents, data]);
      }
    });
  };

  const closeWebsockToController = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  let layout = (
    <Stack orientation="vertical" spacing="space40">
      <Card padding="space120">
        <Heading as="h1" variant="heading30" marginBottom="space40">
          Conversation Transcription
        </Heading>
        <MessageLog events={events} />
      </Card>
    </Stack>
  );

  return layout;
});
export default Transcript;
