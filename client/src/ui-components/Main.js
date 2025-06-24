import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Device } from "@twilio/voice-sdk";

import { useAtom } from "jotai";
import { appDevice, appCurrentCall } from "../jotaiState/appState";

import { Theme } from "@twilio-paste/core/dist/theme";

import { updateUserHelper } from "../helpers/clientDataHelper";

import { Flex, Box, Grid, Column, Stack, Alert } from "@twilio-paste/core";

import AppHeader from "./AppHeader";
import StartCard from "../ui-components/StartCard";
import BotProperties from "./BotConfiguration/BotProperties";
import Audiovisualizer from "./Audiovisualizer/Audiovisualizer";
import Transcript from "./Transcription/Transcript";
import { setupAnalyzer } from "../helpers/utils";
import { use } from "react";

const styles = {
  wrapper: {
    margin: "20px",
  },
};
const Main = () => {
  const [identity, setIdentity] = useState("browser-client");
  //const [device, setDevice] = useState();

  const [device, setDevice] = useAtom(appDevice); // Jotai state for device
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  // Client Websocket
  const transcriptRef = useRef();
  // const [currentCall, setCurrentCall] = useState(null);
  const [currentCall, setCurrentCall] = useAtom(appCurrentCall); // Jotai state for current call

  const [users, setUsers] = useState([]); // all app users ( server > data > users.json )
  const [selectedUser, setSelectedUser] = useState(null); // current app user
  const [useCases, setUseCases] = useState([]); // all use cases defined in the app ( server > data > use-cases.json )
  const [selectedUseCase, setSelectedUseCase] = useState(null); // current use case selected by the user

  // Alert statealert state for updating current user configuration
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("neutral");

  // State to trigger reloading of users and use cases
  const [reload, setReload] = useState(false);

  let voiceToken = useRef("");

  // Setup Audiovisualizer
  let localStream = null; //update useRef / useState
  let remoteStream = null; //update useRef

  const [localAnalyser, setLocalAnalyser] = useState(null);
  const [remoteAnalyser, setRemoteAnalyser] = useState(null);

  // Fetch defined use case from the backend
  useEffect(() => {
    const fetchUseCases = async () => {
      const useCasesURL = process.env.REACT_APP_GET_ALL_USE_CASE_URL;
      try {
        const response = await axios.get(useCasesURL);
        setUseCases(response.data);
      } catch (error) {}
    };
    fetchUseCases();
  }, []);

  // Fetch defined user from the backend
  useEffect(() => {
    const findUser = (users) => {
      const user = users.find((user) => user.key === identity)?.value;
      if (user) {
        setSelectedUser(user);
      } else {
        alert(
          "No user found with the specified identity. Please check the identity and try again."
        );
      }
    };

    // Get all users from backend
    const fetchUsers = async () => {
      const usersURL = process.env.REACT_APP_GET_ALL_USERS_URL;
      try {
        const response = await axios.get(usersURL);
        setUsers(response.data);
        findUser(response.data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };
    fetchUsers();
  }, [reload]);

  // Register Voice Client & Twilio Device Handlers
  useEffect(() => {
    const registerTwilioDeviceHandlers = (device) => {
      device.on("registered", () => console.log("✅ Device registered"));
      device.on("incoming", (conn) => {
        console.log("📞 Incoming call", conn);
        conn.accept();
      });
      device.on("disconnect", () => console.log("🔌 Disconnected"));
      device.on("error", (e) => console.error("❌ Device error:", e));
      device.on("cancel", () => console.log("❎ Call cancelled"));

      device.on("tokenWillExpire", async (dev) => {
        console.log("Device token is expiring\n");
        const registerVoiceClientURL =
          process.env.REACT_APP_REGISTER_VOICE_CLIENT_URL;
        const res = await axios.get(
          registerVoiceClientURL + "?phone=" + identity
        );
        voiceToken.current = res.data;
        setToken(res.data);
        dev.updateToken(res.data);
      });
    };

    // Create a new Twilio Device instance
    const createVoiceDevice = async () => {
      //  get Token from the backend
      const myDevice = await new Device(voiceToken.current, {
        rtcConfiguration: {
          iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
          iceTransportPolicy: "all",
          bundlePolicy: "balanced",
          rtcpMuxPolicy: "require",
          sdpSemantics: "unified-plan",
        },
        audioConstraints: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        logLevel: 5,
        codecPreferences: ["opus", "pcmu"],
      });
      setDevice(myDevice);

      registerTwilioDeviceHandlers(myDevice);
      myDevice.register();
      setLoading(false);
    };

    // create the get token, create/register device
    const registerVoiceClient = async () => {
      console.log("Registering voice client with phone number: ", identity);
      if (!voiceToken.current) {
        try {
          const registerVoiceClientURL =
            process.env.REACT_APP_REGISTER_VOICE_CLIENT_URL;
          const res = await axios.get(
            registerVoiceClientURL + "?phone=" + identity
          );
          voiceToken.current = res.data;
          setToken(res.data);
          createVoiceDevice();
        } catch (e) {
          console.log(e);
        }
      }
    };
    registerVoiceClient(identity);
  }, []);

      useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000); // Hide alert after 5 seconds
            return () => clearTimeout(timer);
        }
    },[showAlert])

  // Handler to iniitate the Ai conversations
  // forwarded through props to StartCard component
  const placeCall = async (phone) => {
    if (device && !currentCall) {
      console.log("Placing call to: ", phone);
      let params = {
        From: "browser-client",
      };
      const call = await device.connect(params);

      if (call) {
        call.on("accept", (call) => {
          console.log("✅ Call connected");
        });

        // Set local and remote streams for audio visualizer
        call.on("volume", (inputVolume, outputVolume) => {
          if (outputVolume > 0) {
            if (!localStream) {
              localStream = call.getLocalStream();
              setLocalAnalyser(setupAnalyzer(localStream));
            }
          }
          if (inputVolume > 0) {
            if (!remoteStream) {
              remoteStream = call.getRemoteStream();
              setRemoteAnalyser(setupAnalyzer(remoteStream));
            }
          }
        });

        call.on("disconnect", () => {
          console.log("📞 Call ended");
          localStream = null;
          remoteStream = null;
        });
        call.on("error", (err) => console.error("❌ Call error:", err));
      } else {
        console.warn("🚫 No call object returned");
      }
      setCurrentCall(call);

      // Register Client Websocket
      if (transcriptRef.current) {
        console.log("Initializing websocket connection");
        transcriptRef.current.invokeSetupWebsockToController();
      }
    } else {
      console.log("Device not ready");
    }
  };

  // Handler to stop the Ai conversations
  // forwarded through props to StartCard component
  const stopCall = async () => {
    device.disconnectAll();
    setCurrentCall(null);
    if (transcriptRef.current) {
      transcriptRef.current.invokeCloseWebsockToController();
    }
  };

  // handler to update the user configuration
  // forwarded through props to BotProperties > useCaseCombo component
  const updateUser = async (agentParams) => {
    let data = {
      firstName: "Jane",
      lastName: "Doe",
      from: "browser-client",
      role: selectedUser.role,
      identity: selectedUser.identity,
      type: selectedUser.type,
      phone: selectedUser.phone,
      email: selectedUser.email,
      useCase: agentParams.useCase,
      conversationRelayParamsOverride: {
        language: "en-US",
        ttsProvider: agentParams.ttsProvider,
        voice: agentParams.voice,
        transcriptionProvider: agentParams.sttProvider,
        speechModel: agentParams.speechModel,
        interruptible: "any",
        preemptible: true,
        welcomeGreetingInterruptible: "none",
        welcomeGreetingPreemptible: true,
      },
    };

    let resp = await updateUserHelper(data);
    if (resp.status === "success") {
      setAlertMessage("User configuration updated successfully");
      setAlertType("neutral");
      setShowAlert(true);
    } else {
      setAlertMessage("Failed to update user configuration");
      setAlertType("error");
      setShowAlert(true);
    }
    setReload(!reload);
  };

  // Main layout of the application
  let layout = (
    <div>
      <Box
        style={{ marginTop: 10 }}
        width="100%"
        height="100vh"
        padding="space50"
      >
        {showAlert && (
          <Alert
            variant={alertType}
            onDismiss={() => setShowAlert(false)}
            marginBottom="space40"
          >
            {alertMessage}
          </Alert>
        )}
        <Grid gutter="space40">
          <Column span={[12, 12, 8]}>
            <Box paddingTop="space50">
              <Stack orientation="vertical" spacing="space40">
                <StartCard placeCall={placeCall} stopCall={stopCall} />
                <Audiovisualizer
                  localAnalyser={localAnalyser}
                  remoteAnalyser={remoteAnalyser}
                />
                <Transcript ref={transcriptRef} identity={identity} />
              </Stack>
            </Box>
          </Column>
          <Column span={[12, 12, 4]}>
            <Box paddingTop="space50">
              <BotProperties
                useCases={useCases}
                selectedUser={selectedUser}
                updateUser={updateUser}
              />
            </Box>
          </Column>
        </Grid>
      </Box>
      {/* end Primary Box */}
    </div>
  );
  return layout;
};
export default Main;
