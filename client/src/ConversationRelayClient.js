import { useState, useRef } from 'react';
import axios from "axios";
import { Device } from "@twilio/voice-sdk";
import "./styles/ConversationRelayClient.css";
import audiovisualizer from "./templates/audiovisualizer";
// import AudioDevices from "./components/AudioDevices";
// import ReactAudioVisualizer from "./components/ReactAudioVisualizer";
import LatencyVisualizer from "./components/LatencyVisualizer";
// import AudioProcessor from "./AudioProcessor.ts";

import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

// Twilio Paste
import { Theme } from "@twilio-paste/core/dist/theme";
import {
  Box,
  Heading,
  Label,
  Button,
  Stack,
  InPageNavigation,
  InPageNavigationItem,
} from "@twilio-paste/core";

// import { Switch } from "@twilio-paste/core";

import UseCasePicker from "./components/UseCasePicker";

export const ConversationRelayClient = () => {
  const [device, setDevice] = useState();
  const [loading, setLoading] = useState(true);
  // const [noiseCancellation, setNoiseCancellation] = useState(false);
  const [phone, setPhone] = useState("");
  const [whichPage, setWhichPage] = useState(true);
  const [personalized, setPersonalized] = useState(false);

  let voiceToken = useRef("");
  // const processor = new AudioProcessor();

  const registerTwilioDeviceHandlers = (device) => {
    device.on("incoming", function (conn) {
      console.log(
        "Call incoming: " +
          conn.parameters.From +
          ", Call SID: " +
          conn.parameters.CallSid +
          ""
      );
    });

    device.on("registered", (dev) => {
      console.log("Device ready to receive incoming calls\n");
    });

    device.on("unregistered", (dev) => {
      console.log("Device unregistered\n");
      setDevice(undefined);
    });

    device.on("tokenWillExpire", (dev) => {
      console.log("Device token is expiring\n");
    });

    device.on("error", (dev) => {
      console.log("Device encountered error\n", dev);
      setDevice(undefined);
    });

    device.on("destroyed", (dev) => {
      console.log("Device destroyed\n");
      setDevice(undefined);
    });
  };

  // const enableAudioProcessor = async () => {
  //   if (!device.audio._processor) {
  //     await device.audio.addProcessor(processor);
  //     console.log("Added audio processor");
  //     setNoiseCancellation(true); // this is causing the issue
  //   } else {
  //     console.log("Audio processor already enabled");
  //   }
  // };

  // const disableAudioProcessor = async () => {
  //   if (device.audio._processor) {
  //     await device.audio.removeProcessor(device.audio._processor);
  //     console.log("Disabled audio processor");
  //     setNoiseCancellation(false); // this is causing the issue
  //   } else {
  //     console.log("No audio processor to remove");
  //   }
  // };

  const createVoiceDevice = async () => {
    const myDevice = await new Device(voiceToken.current, {
      logLevel: 5,
      codecPreferences: ["opus", "pcmu"],
    });
    setDevice(myDevice);
    setLoading(false);
    myDevice.register();
    registerTwilioDeviceHandlers(myDevice);
    //audiovisualizer.setupAudioVisualizerCanvas();
  };

  const registerVoiceClient = async (phone) => {
    if (!voiceToken.current) {
      try {
        const registerVoiceClientURL =
          process.env.REACT_APP_REGISTER_VOICE_CLIENT_URL;
        const res = await axios.get(registerVoiceClientURL + "?phone=" + phone);
        voiceToken.current = res.data;
        createVoiceDevice();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Theme.Provider theme="Twilio">
      <Box paddingX="space100">
        <Theme.Provider theme="Twilio">
          <Box display="flex" flexDirection="column">
            <Box padding="space50">
              <Heading as="h2" variant="heading20">
                ConversationRelay Client
                {/* <AudioDevices /> */}
              </Heading>
              {/* <DBProfile /> */}
              {loading ? (
                <div>
                  { /* <Label required>Enter Phone Number</Label> */ }
                  <Stack orientation="horizontal" spacing="space40">
                    { /* <PhoneInput
                      defaultCountry="us"
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                    /> */ }
                    <Button variant="destructive" onClick={() => registerVoiceClient("browser-client")}>
                      🤷‍♂️ Ask a Question
                    </Button>
                  </Stack>
                </div>
              ) : (
                <div>
                  {/* <Switch
                    value={noiseCancellation}
                    onClick={(e) => {
                      noiseCancellation === false
                        ? enableAudioProcessor()
                        : disableAudioProcessor();
                    }}
                  >
                    Enable Noise Cancellation
                  </Switch> */}
                </div>
              )}

             {/*} <InPageNavigation>
                <InPageNavigationItem
                  currentPage={whichPage}
                  onClick={() => {
                    setWhichPage(true);
                    setPersonalized(false);
                  }}
                >
                  A/B Testing
                </InPageNavigationItem>
                <InPageNavigationItem
                  currentPage={!whichPage}
                  onClick={() => {
                    setWhichPage(false);
                    setPersonalized(true);
                  }}
                >
                  Personalized Agent
                </InPageNavigationItem>
              </InPageNavigation> */}
              {whichPage ? (
                <div>
                  <UseCasePicker
                    personalized={personalized}
                    device={device}
                    loading={loading}
                  />
                  <Label htmlFor="audio-visualizer">Audio Visualizer</Label>
                  <canvas id="audio-visualizer"></canvas>
                </div>
              ) : (
                <div>
                  <UseCasePicker
                    personalized={personalized}
                    device={device}
                    loading={loading}
                  />
                  <Label htmlFor="audio-visualizer">Audio Visualizer</Label>
                  <canvas id="audio-visualizer"></canvas>
                </div>
              )}

              {/* <ReactAudioVisualizer /> */}
              {/* <LatencyVisualizer /> */}
            </Box>
          </Box>
        </Theme.Provider>
      </Box>
    </Theme.Provider>
  );
};

export default ConversationRelayClient;