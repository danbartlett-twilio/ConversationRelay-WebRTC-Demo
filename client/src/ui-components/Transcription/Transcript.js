import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Stack, Card, Flex, Heading, Switch, Box } from "@twilio-paste/core";

// import MessageLog from "./MessageLog";
import MessageLog from "./MessageLog";
import "../../styles/MessageLog.css"; // Import the CSS styles

const Transcript = forwardRef((props, ref) => {
  const [socket, setSocket] = useState(null);
  const [showLatency, setShowLatency] = useState(false);
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

  const toggleLatency = () => {
    showLatency ? setShowLatency(false) : setShowLatency(true);
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
        <Flex>
          <Flex>
            <Box>
              <Heading as="h1" variant="heading30" marginBottom="space40">
                Conversation Transcription
              </Heading>
            </Box>
          </Flex>
          <Flex grow></Flex>
          <Flex>
            <Box>
              <Switch
                id="latency-toggle"
                checked={showLatency}
                onChange={toggleLatency}
              >
                Show Latency
              </Switch>
            </Box>
          </Flex>
        </Flex>
                    <Box
                      overflowY="auto"
                      overflowX="auto"
                      maxHeight="50vh"
                      width="100%"
                      maxWidth={["100%", "100%", "100%"]} // full width on mobile, max 800px on desktop
                      padding="space40"
                      style={{border: '1px solid #eaeaea', borderRadius: '8px'}}
                    >
        <MessageLog events={events} showLatency={showLatency} />
        </Box>
      </Card>
    </Stack>
  );

  return layout;
});
export default Transcript;
