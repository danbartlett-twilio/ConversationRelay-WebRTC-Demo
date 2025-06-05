import { useState, useRef, useImperativeHandle, forwardRef } from "react";

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

    // Listen for messages
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

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

  let layout = <MessageLog events={events} />;

  return layout;
});
export default Transcript;
