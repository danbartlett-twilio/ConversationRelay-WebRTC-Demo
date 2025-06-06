import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import Wrapper from "./ui-components/Wrapper";


console.log("Starting ConversationRelayClient => ", process.env.REACT_APP_REGISTER_VOICE_CLIENT_URL);
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Wrapper />
  </StrictMode>
);