import {
  Stack,
  Card,
  Heading,
  Paragraph,
  Button,
  // Tooltip,
} from "@twilio-paste/core";

import { useState } from "react";

import { StopIcon } from "@twilio-paste/icons/esm/StopIcon";
import { MicrophoneOnIcon } from "@twilio-paste/icons/esm/MicrophoneOnIcon";

const StartCard = (props) => {
  const [pausePressed, setPausePressed] = useState(true);

  //  handler to start the ai conversation
  const handleStartClick = () => {
    props.placeCall("browser-client");
  };

  //  handler to end the ai conversation
  const handleStopClick = () => {
    props.stopCall();
  };

  //  layout for the start card
  let layout = (
    <Stack orientation="vertical" spacing="space40">
      <Card padding="space120">
        <Heading as="h2" variant="heading20">
          ConversationRelay WebRTC Quickstart
        </Heading>
        <Paragraph>
          Connecting to an AI Agent is simple. Press the button below to get
          started.
        </Paragraph>
        <Stack orientation={"horizontal"} spacing="space40">
          <Button
            variant="secondary_icon"
            pressed={pausePressed}
            onClick={() => {
              if (pausePressed) {
                handleStartClick();
              } else {
                handleStopClick();
              }
              setPausePressed(!pausePressed);
            }}
          >
            Talk to ConversationRelay Agent
            {pausePressed ? (
              <MicrophoneOnIcon decorative />
            ) : (
              <StopIcon decorative color="colorTextError" />
            )}
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
  return layout;
};
export default StartCard;
