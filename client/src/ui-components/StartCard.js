import { Stack, Card, Heading, Paragraph, Button, Tooltip } from '@twilio-paste/core';
import { StopIcon } from "@twilio-paste/icons/esm/StopIcon";

const StartCard = (props) => {

    //  handler to start the ai conversation
    const handleStartClick = () => {  
      props.placeCall("browser-client")
    }

    //  handler to end the ai conversation
    const handleStopClick = () => {  props.stopCall() }

    //  layout for the start card
    let layout = (
            <Stack orientation="vertical" spacing="space40">
      <Card padding="space120">
        <Heading as="h2" variant="heading20">
          Conversation Relay WebRTC Quickstart
        </Heading>
        <Paragraph>
          Connecting to an Ai Agent is simple. Press the button below to get started.
        </Paragraph>
        <Stack orientation={'horizontal'} spacing="space40">
            <Tooltip text="Start a conversation" placement="bottom">
              <Button variant="primary" onClick={handleStartClick}>
                Talk to a ConversationRelay Agent
              </Button>
            </Tooltip>
            <Tooltip text="Stop Ai'ing" placement="bottom">
              <Button variant="destructive_icon" size={'reset'} onClick={handleStopClick}>
                <StopIcon decorative={false} size="sizeIcon80" title="Stop" />
              </Button>
            </Tooltip>
        </Stack>
      </Card>
    </Stack>
    )
    return layout
}
export default StartCard;


