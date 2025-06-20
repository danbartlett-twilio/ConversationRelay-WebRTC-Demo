import { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Column,
  Alert,
  Tooltip,
  Heading,
  Text,
  DetailText,
  Card,
  Box,
  Input,
  AlertDialog,
  Button,
  Table,
  THead,
  TBody,
  Tr,
  Th,
  Label,
  SideModalContainer,
  SideModal,
  SideModalHeader,
  SideModalHeading,
  SideModalBody,
  Paragraph,
  useSideModalState,
} from "@twilio-paste/core";

import { SearchIcon } from "@twilio-paste/icons/esm/SearchIcon";

import SelectedCall from "./SelectedCall";
import CallRecord from "./CallRecord";

import { deleteCallHelper } from "../../helpers/clientDataHelper";

const CallList = () => {
  const [search, setSearch] = useState("");
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [selectedCallChat, setSelectedCallChat] = useState(null);
  const [reload, setReload] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteCall, setDeleteCall] = useState(null);

  // Alert state alert state for updating current user configuration
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("neutral");

  // Fetch all users from the backend when the component mounts or reload state changes
  useEffect(() => {
    //   get all users from the backend

    const fetchSessions = async () => {
      const sessionsURL = process.env.REACT_APP_GET_ALL_SESSIONS_URL;

      try {
        const response = await axios.get(sessionsURL);
        setSessions(response.data);
        setFilteredSessions(response.data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };
    fetchSessions();
  }, [reload]);

  useEffect(() => {
    console.log("selectedCall changed", selectedCall);

    const fetchSessionChat = async () => {
      if (selectedCall) {
        const sessionURL =
          process.env.REACT_APP_GET_SESSION_URL +
          `?callSid=${selectedCall.key}`;
        try {
          const response = await axios.get(sessionURL);
          console.log("session data", response.data);
          setSelectedCallChat(response.data.sessionData.sessionChats);
        } catch (error) {
          console.error("Error fetching session chat: ", error);
        }
      }
    };
    fetchSessionChat();
  }, [selectedCall]);

  // handler to clear search input and reset filtered users
  const clearSearch = () => {
    setSearch("");
    setFilteredSessions(sessions);
  };

  // handler to filter users based on search input
  const handleSearchChange = (event) => {
    setSearch(event.target.value.toLowerCase());
    setFilteredSessions(
      Object.values(sessions).filter((call) =>
        call.value.useCase
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      )
    );
  };

  // handler to select a user from the list and display their details
  const handleCallSelect = (call) => {
    console.log("handleUserSelect", call);
    setSelectedCall(call);
  };

  // handler to refresh the user list
  const handleRefresh = () => {
    setSelectedCall(null);
    setReload(!reload);
    setAlertMessage("Session list reloaded");
    setAlertType("neutral");
    setShowAlert(true);
  };

  // handler to display the delete user dialog
  const dialogDeleteCall = (call) => {
    setShowDeleteDialog(true);
    setDeleteCall(call);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeleteCall(null);
  };

  // handler to delete a user from the list
  const handleCallDelete = async () => {
    console.log("handleCallDelete", deleteCall);
    const callSid = { callSid: deleteCall.key };
    //  Call server API to create the user
    let resp = await deleteCallHelper(callSid);

    if (resp.status === "success") {
      setAlertMessage("Session history was successfully deleted");
      setAlertType("neutral");
      setShowAlert(true);
    } else {
      setAlertMessage("An error has occurred deleting this session data.");
      setAlertType("error");
      setShowAlert(true);
    }
    setShowDeleteDialog(false);
    setDeleteCall(null);
    setReload(!reload);
  };

  // handler to create new application users
  const createUser = async (user) => {
    let from = "";
    switch (user.type) {
      case "webRtc":
        from = `client:${user.identity}`;
        break;
      case "sip":
        from = `sip:${user.identity}`;
        break;
      case "phone":
        from = user.identity; // phone number
        break;
      default:
    }

    // structure the submitted user attributes
    const userAttributes = {
      identity: user.identity,
      from: from,
      role: "user",
      type: user.type,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
    };
    let resp = await createUserHelper(userAttributes);
    if (resp.status === "success") {
      setAlertMessage("User configuration created successfully");
      setAlertType("neutral");
      setShowAlert(true);
      setReload(!reload);
    } else {
      setAlertMessage("An error has occurred creating this user.");
      setAlertType("error");
      setShowAlert(true);
    }
    dialog.hide();
  };

  // Render the users page
  let layout = (
    <div>
      <Box
        style={{ marginTop: 10 }}
        width="100%"
        height="100vh"
        padding="space50"
      >
        <Grid gutter="space40">
          <Column span={[12, 12, 12]}>
            <div style={{ marginBottom: "10px" }}>
              {/* Display application alerts */}
              {showAlert && (
                <Alert
                  variant={alertType}
                  onDismiss={() => setShowAlert(false)}
                  marginBottom="space40"
                >
                  {alertMessage}
                </Alert>
              )}
            </div>
          </Column>
          <Column span={[12, 12, 4]}>
            <Box paddingTop={"space50"}>
              <Card marginLeft={"100px"} width="100%">
                <Heading as="h3" variant="heading30" marginBottom="space40">
                  Ai Session History
                </Heading>
                <Paragraph marginBottom="space40">
                  Review past Ai Sessions, their details and transcripts.
                </Paragraph>

                <Box overflowY="auto" height="auto" maxHeight="500px">
                  <Box style={{ marginBottom: "20px" }} padding="space20">
                    <Label htmlFor="search">Filter</Label>
                    <Input
                      aria-describedby="search"
                      id="search"
                      name="email_address"
                      type="text"
                      value={search}
                      insertAfter={
                        <Tooltip text="Clear Search" placement="top">
                          <Button variant="link" onClick={clearSearch}>
                            <SearchIcon
                              decorative={false}
                              size="sizeIcon20"
                              title="Get more info"
                              onClick={clearSearch}
                            />
                          </Button>
                        </Tooltip>
                      }
                      onChange={(e) => {
                        handleSearchChange(e);
                      }}
                    />
                  </Box>
                  <Table>
                    <THead stickyHeader top={0}>
                      <Tr>
                        <Th>View</Th>
                        <Th>Ai Session</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      {Object.values(filteredSessions).map((call, index) => (
                        <CallRecord
                          key={index}
                          call={call}
                          deleteCall={dialogDeleteCall}
                          callSelect={handleCallSelect}
                        />
                      ))}
                    </TBody>
                  </Table>
                </Box>
                <Box
                  as="div"
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleRefresh()}
                    fullWidth
                  >
                    Refresh
                  </Button>
                </Box>
              </Card>
            </Box>
          </Column>
          <Column span={[12, 12, 8]}>
            <Box paddingTop={"space50"}>
              <Card>
                <Heading as="h3" variant="heading30" marginBottom="space40">
                  Session Details
                </Heading>
                <Paragraph marginBottom="space40">
                  Details of the Ai session.
                </Paragraph>
                <SelectedCall
                  mode={"edit"}
                  selectedCall={selectedCall}
                  selectedCallChat={selectedCallChat}
                />
              </Card>
            </Box>
          </Column>
        </Grid>

        {/* Alert visualization for user deletion */}
        <AlertDialog
          heading="Delete Ai Session"
          isOpen={showDeleteDialog}
          onConfirm={handleCallDelete}
          onConfirmLabel="Delete"
          onDismiss={() => handleCloseDeleteDialog(false)}
          onDismissLabel="Cancel"
        >
          <Paragraph>
            Are you sure you want to delete this Ai Session?
          </Paragraph>
          <Paragraph>CallSid: {deleteCall?.key}</Paragraph>
          <Paragraph>
            This will delete all session and transcript data for the selected
            session.
          </Paragraph>
          <Paragraph>This action cannot be undone.</Paragraph>
        </AlertDialog>
      </Box>
    </div>
  );
  return layout;
};
export default CallList;
