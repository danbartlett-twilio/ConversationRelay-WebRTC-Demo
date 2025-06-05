import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Device } from "@twilio/voice-sdk";

import { Theme } from "@twilio-paste/core/dist/theme";

import {
  Flex,
  Box,
  Heading,
  Grid,
  Column,
  Stack,
  Alert,
} from "@twilio-paste/core";

import StartCard from "../ui-components/StartCard";
import BotProperties from "../ui-components/BotProperties";
import Visualizer from "../ui-components/Visualizer";
import Transcript from "../ui-components/Transcript";
// import Transcript from "../components/Visualizer";

const styles = {
  wrapper: {
    margin: "20px",
  },
};
const Main = () => {
  const [identity, setIdentity] = useState("browser-client");
  const [device, setDevice] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  // Client Websocket
  const transcriptRef = useRef();
  //   const [socket, setSocket] = useState(null);

  const [currentCall, setCurrentCall] = useState(null);

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

  // Fetch defined use cases and users from the backend
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

  // Fetch defined use cases and users from the backend
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

    //   get all users from the backend
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

  // Register Twilio Device event handlers
  useEffect(() => {
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

      device.on("error", (dev) => {
        console.log("Device encountered error\n", dev);
        setDevice(undefined);
      });

      device.on("destroyed", (dev) => {
        console.log("Device destroyed\n");
        setDevice(undefined);
      });
    };

    // Create a new Twilio Device instance
    const createVoiceDevice = async () => {
      //  get Token from the backend
      const myDevice = await new Device(voiceToken.current, {
        logLevel: 5,
        codecPreferences: ["opus", "pcmu"],
      });
      setDevice(myDevice);
      setLoading(false);
      myDevice.register();
      registerTwilioDeviceHandlers(myDevice);
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

  // Handler to iniitate the Ai conversations
  // forwarded through props to StartCard component
  const placeCall = async (phone) => {
    if (device && !currentCall) {
      console.log("Placing call to: ", phone);
      let params = {
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
        params: {
          From: "browser-client",
        },
      };
      const conn = device.connect(params);
      console.log(
        "Call connection established: ",
        JSON.stringify(conn, null, 2)
      );
      setCurrentCall(conn);

      // registerClientWebsocket
      console.log(transcriptRef);
      if (transcriptRef.current) {
        console.log("Initializing websocket connection");
        transcriptRef.current.invokeSetupWebsockToController();
      }

      //   const clientWS = registerClientWebsocket();
      //   console.log(
      //     "Client WS connection established: ",
      //     JSON.stringify(clientWS, null, 2)
      //   );
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
      identity: identity,
      from: "client:browser-client",
      firstName: "Jane",
      lastName: "Doe",
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

    //  call backend to update user configuration ( server > data > users.json )
    try {
      // Fetch all voices from the backend
      const updateUserURL = process.env.REACT_APP_UPDATE_USER_URL;
      await axios.post(updateUserURL, data).then((resp) => {
        if (resp.data.status === "success") {
          setAlertMessage("User configuration updated successfully");
          setAlertType("neutral");
          setShowAlert(true);
        } else {
          setAlertMessage("Failed to update user configuration");
          setAlertType("error");
          setShowAlert(true);
        }
        setReload(!reload);
      });
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  // Create a new Twilio Device instance
  //   const registerClientWebsocket = async () => {
  //     // const socket = new WebSocket("/?callSid=" + identity);
  //     // For developing use this url to get events without having to re-build
  //     const socket = new WebSocket("ws://localhost:3000/?callSid=" + identity);
  //     console.log(socket);
  //     setSocket(socket);
  //     // Connection opened
  //     socket.addEventListener("open", (event) => {
  //       socket.send(JSON.stringify({ message: "Connection established" }));
  //       console.log("Connection opened!");
  //     });

  //     // Listen for messages
  //     socket.addEventListener("message", (event) => {
  //       console.log("Message from server ", event.data);
  //     });
  //   };

  // Main layout of the application
  let layout = (
    <Theme.Provider theme="Twilio">
      <Flex>
        <Flex>
          <Box padding="space100">&nbsp;</Box>
        </Flex>
        <Flex grow>
          {/* Primary Box */}
          <Box
            padding="space20"
            width="100%"
            height="20vh"
            style={{ marginTop: "20px" }}
          >
            <div style={styles.headTwoColumnLayout}>
              <div style={styles.headLeftColumn}>
                <img
                  src="/images/twilio_logo.jpg"
                  alt="Twilio Logo"
                  width="100"
                  height="50"
                />{" "}
              </div>
              <div style={styles.headRightColumn}>
                <Heading
                  marginBottom="space0"
                  as="h2"
                  variant="heading8"
                  color={{ color: "#ffffff" }}
                >
                  Conversation Relay - Cloud Intelligence
                </Heading>
              </div>
            </div>
            <Box style={{ marginTop: 100 }} height="100vh">
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
                <Column span={7}>
                  <Box padding="space50">
                    <Stack orientation="vertical" spacing="space40">
                      <StartCard placeCall={placeCall} stopCall={stopCall} />
                      <Visualizer />
                      <Transcript ref={transcriptRef} identity={identity} />
                    </Stack>
                  </Box>
                </Column>
                <Column span={5}>
                  <Box padding="space50">
                    <BotProperties
                      useCases={useCases}
                      selectedUser={selectedUser}
                      updateUser={updateUser}
                    />
                  </Box>
                </Column>
              </Grid>
            </Box>
          </Box>
          {/* end Primary Box */}
        </Flex>
        <Flex>
          <Box
            // backgroundColor="colorBackgroundPrimaryWeak"
            padding="space100"
            // height="size20"
          >
            &nbsp;
          </Box>
        </Flex>
      </Flex>
    </Theme.Provider>
  );
  return layout;
};
export default Main;
