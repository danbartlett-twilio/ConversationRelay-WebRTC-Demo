
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Device } from "@twilio/voice-sdk";

import { Theme } from "@twilio-paste/core/dist/theme";

import { updateUserHelper } from "../helpers/clientDataHelper";

import {
    Flex, Box, Heading,
    Grid, Column, 
    Stack, Alert
} from '@twilio-paste/core';

import AppHeader from "./AppHeader";
import StartCard from "../ui-components/StartCard"
import BotProperties from "../ui-components/BotProperties";
import Visualizer from "../ui-components/Visualizer";
import Transcript from "../ui-components/Transcript";

const styles = {
    wrapper : {
        margin : '20px'
    }
}
const Main = () => {

    const [identity, setIdentity] = useState("browser-client");

    const [device, setDevice] = useState();
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState("");


    const [currentCall, setCurrentCall] = useState(null);

    const [users, setUsers] = useState([]);                     // all app users ( server > data > users.json )    
    const [selectedUser, setSelectedUser] = useState(null);     // current app user
    const [useCases, setUseCases] = useState([]);               // all use cases defined in the app ( server > data > use-cases.json )  
    const [selectedUseCase, setSelectedUseCase] = useState(null);   // current use case selected by the user
    
    // Alert statealert state for updating current user configuration
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("neutral");

    // State to trigger reloading of users and use cases
    const[reload, setReload] = useState(false);

    let voiceToken = useRef("");

    // Fetch defined use cases and users from the backend
    useEffect(() => {
        const fetchUseCases = async () => {
            const useCasesURL = process.env.REACT_APP_GET_ALL_USE_CASE_URL;
            try {
                const response = await axios.get(useCasesURL);
                setUseCases(response.data);
            } catch (error) {
            }
        }
        fetchUseCases();
    },[]);

    // Fetch defined use cases and users from the backend
    useEffect(() => {
        const findUser = (users) => {
            const user = users.find((user) => user.key === identity)?.value
            if (user) {
                setSelectedUser(user);
            } else {
                alert("No user found with the specified identity. Please check the identity and try again.");
            }
        }

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
        }
        fetchUsers();   
    },[reload]);

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
                const res = await axios.get(registerVoiceClientURL + "?phone=" + identity);
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
                const res = await axios.get(registerVoiceClientURL + "?phone=" + identity);
                voiceToken.current = res.data;
                setToken(res.data);
                createVoiceDevice();
                } catch (e) {
                console.log(e);
                }
            }
    }; 
    registerVoiceClient(identity);

    }, [])


    // Handler to iniitate the Ai conversations
    // forwarded through props to StartCard component
    const placeCall = async (phone) => {
        if (device && !currentCall) {
            console.log("Placing call to: ", phone);
            let params = { 
                rtcConfiguration: {
                iceServers: [
                    { urls: ['stun:stun.l.google.com:19302'] }
                ],
                iceTransportPolicy: 'all',
                bundlePolicy: 'balanced',
                rtcpMuxPolicy: 'require',
                sdpSemantics: 'unified-plan'
                },
                audioConstraints: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                params: {
                    From: 'browser-client',
                }
            }
            const conn = device.connect(params);
            setCurrentCall(conn);
            
        } else {
            console.log("Device not ready");
        }
    }

    // Handler to stop the Ai conversations
    // forwarded through props to StartCard component
    const stopCall = async () => {
        device.disconnectAll();
        setCurrentCall(null);
    }


    // handler to update the user configuration
    // forwarded through props to BotProperties > useCaseCombo component
    const updateUser = async (agentParams) => {
        let data = { 
                "firstName": "Jane",
                "lastName": "Doe",
                "from": "client:browser-client",
                "role": selectedUser.role,
                "identity": selectedUser.identity,
                "type": selectedUser.type,
                "phone": selectedUser.phone,
                "email": selectedUser.email,             
                "useCase": agentParams.useCase,
                "conversationRelayParamsOverride": {            
                "language" : "en-US",
                "ttsProvider" : agentParams.ttsProvider,
                "voice" : agentParams.voice,
                "transcriptionProvider" : agentParams.sttProvider,
                "speechModel" : agentParams.speechModel,
                "interruptible" : "any",
                "preemptible" : true,
                "welcomeGreetingInterruptible" : "none",
                "welcomeGreetingPreemptible" : true
            }
        }

        let resp = await updateUserHelper(data)
        if (resp.status==='success') {
            setAlertMessage('User configuration updated successfully');
            setAlertType("neutral")
            setShowAlert(true)
        } else {
            setAlertMessage('Failed to update user configuration');
            setAlertType("error")
            setShowAlert(true)
        }
            setReload(!reload)
    }

    // Main layout of the application
    let layout = (
        <div>
            <Box style={{marginTop:10, }} height="100vh">
                { showAlert && (
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
                                <StartCard  placeCall={placeCall} stopCall={stopCall} />
                                <Visualizer />
                                <Transcript />
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

        {/* end Primary Box */}
        </div>

    )
    return layout;
}
export default Main;