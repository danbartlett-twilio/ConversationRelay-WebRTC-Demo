import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import Main from "./ui-components/Main";
import  ConversationRelayClient  from "./ConversationRelayClient";

// import ConversationRelayClient from "./ConversationRelayClient";
console.log("Starting ConversationRelayClient => ", process.env.REACT_APP_REGISTER_VOICE_CLIENT_URL);
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    {/* <ConversationRelayClient /> */}
    <Main />
  </StrictMode>
);