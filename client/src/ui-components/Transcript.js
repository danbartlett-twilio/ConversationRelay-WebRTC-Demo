import { Box, Card, TextArea } from "@twilio-paste/core";
import { useState, useRef, useImperativeHandle, forwardRef } from "react";

const Transcript = forwardRef((props, ref) => {
  // const socket = props.socket;
  // console.log(socket);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState("");
  const textLog = useRef(null);

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
    // const socket = new WebSocket("/?callSid=" + identity);
    // For developing use this url to get events without having to re-build
    const socket = new WebSocket("ws://localhost:3000/?callSid=" + identity);
    setSocket(socket);

    // Connection opened
    socket.addEventListener("open", (event) => {
      socket.send(JSON.stringify({ message: "Connection established" }));
      console.log("Connection opened!");
      setMessages(" --- Connected to ConversationRelay ---\n");
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
      let message;
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.type === "info") {
        message = JSON.stringify(data) + "\n";
      }

      setMessages((prev) => {
        if (message) {
          return prev + message;
        } else {
          return prev;
        }
      });
    });
  };

  const closeWebsockToController = () => {
    if (socket) {
      socket.close();
      setSocket(null);
      setMessages(
        (prev) => prev + "\n --- Disconnected from ConversationRelay ---"
      );
    }
  };

  let layout = (
    <Card padding="space40">
      <Box as="div" style={{ backgroundColor: "#ccc", height: "20vh" }}>
        Transcript
      </Box>
      <TextArea
        id="statusArea"
        className="status-area"
        name="statusArea"
        value={messages}
        ref={textLog} // Used to autoscroll
        row="10"
        maxRows="10"
        readOnly
        style={{
          overflowY: "auto", // Enable vertical scrolling
        }}
      />
    </Card>
  );

  return layout;
});
export default Transcript;
