import express from "express";
const router = express.Router();
import cors from "cors";
import url from "url";
//import path from "path";
//import { fileURLToPath } from 'url';

router.use(cors()); // Enable CORS for all routes
router.use(express.json()); // for parsing application/json
import { FSDB } from "file-system-db";

// Route retrieve all useCases from data/useCases.json
// URI:  <server>/client-data/get-use-cases
// Method: GET
// Description: This route retrieves all use cases from the useCases.json file and sends them as a response.
router.get("/get-use-cases", async (req, res) => {
  //console.log("get-use-cases called");
  const useCases = new FSDB(`../data/use-cases.json`, false);
  //console.log("useCases", useCases.getAll());
  const allUseCases = useCases.getAll();
  res.send(allUseCases);
});

// URI:  <server>/client-data/update-use-case
// Method: GET
// Description: This route updates specific use case from data passed in the request.
router.get("/update-use-case", async (req, res) => {
  const useCases = new FSDB(`../data/use-cases.json`, false);
  res.send("hello");
});

// URI:  <server>/client-data/get-users
// Method: GET
// Description: Retrieve list of all users.
router.get("/get-users", async (req, res) => {
  const users = new FSDB(`../data/users.json`, false);
  const allUsers = users.getAll();
  res.send(allUsers);
});

// URI:  <server>/client-data/update-user
// Method: POST
// Description: This route updates specific user from data passed in the request.
router.post("/update-user", async (req, res) => {
  console.log("update-user called with body: ", req.body);

  const users = new FSDB(`../data/users.json`, false);

  const userIdentity = req.body.identity;
  users.set(userIdentity, {
    from: req.body.from,
    role: req.body.role,
    type: req.body.type, // webRtc, sip, phone
    identity: req.body.identity,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    useCase: req.body.useCase,
    conversationRelayParamsOverride: req.body.conversationRelayParamsOverride,
  });
  res.send({ status: "success", data: users.get(userIdentity) });
});

// URI:  <server>/client-data/create-user
// Method: POST
// Description: API to create a new application user
//  create user with defaults for CR Params Override
//
router.post("/create-user", async (req, res) => {
  const users = new FSDB(`../data/users.json`, false);

  let userIdentity = "";
  if (req.body.type === "sip") {
    userIdentity = req.body.identity.replace(/\./g, "<>");
  } else {
    userIdentity = req.body.identity; // webRtc or phone
  }
  users.set(userIdentity, {
    from: req.body.from,
    role: req.body.role,
    type: req.body.type, // webRtc, sip, phone
    identity: req.body.identity,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    useCase: req.body.useCase,
    conversationRelayParamsOverride: {
      language: "en-US",
      ttsProvider: "ElevenLabs",
      voice: "UgBBYS2sOqTuMpoF3BR0",
      transcriptionProvider: "Google",
      speechModel: "telephony",
      interruptible: "any",
      preemptible: true,
      welcomeGreetingInterruptible: "none",
      welcomeGreetingPreemptible: true,
    },
  });

  res.send({ status: "success", data: users.get(userIdentity) });
});

// URI:  <server>/client-data/delete-user
// Method: POST
// Description: API to delete an application user
router.post("/delete-user", async (req, res) => {
  // get users.json
  const users = new FSDB(`../data/users.json`, false);
  let userIdentity = "";

  // format identity based on user connection type
  if (req.body.type === "sip") {
    userIdentity = req.body.identity.replace(/\./g, "<>");
  } else {
    userIdentity = req.body.identity; // webRtc or phone
  }
  users.delete(userIdentity);

  res.send({ status: "success", data: { identity: userIdentity } });
});

// URI:  <server>/client-data/get-transcription-voices
// Method: GET
// Description: This route updates specific user from data passed in the request.
router.get("/get-transcription-voices", async (req, res) => {
  const voices = new FSDB(`../data/transcription-providers.json`, false);
  const allVoices = voices.getAll();
  res.send(allVoices);
});

// URI:  <server>/client-data/get-sessions
// Method: GET
// Description: Gets all session from the local database
router.get("/get-sessions", async (req, res) => {
  const sessions = new FSDB(`../data/cr-sessions.json`, false);
  res.send(sessions.getAll().reverse());
});

// URI:  <server>/client-data/get-session?callSid=<callSid>
// Method: GET
// Description: Returns the session data for a specific callSid (details and chats)
router.get("/get-session", async (req, res) => {
  const URLparams = url.parse(req.url, true).query;
  //console.log("URLparams => ", URLparams);
  const crSession = new FSDB(
    `../data/sessions/${URLparams.callSid}/session.json`,
    false
  );
  const sessionChats = new FSDB(
    `../data/sessions/${URLparams.callSid}/chats.json`,
    false
  );

  res.send({
    sessionData: {
      sessionData: crSession.getAll(),
      sessionChats: sessionChats.getAll().reverse(),
    },
  });
});

router.post("/delete-session", async (req, res) => {
  // get users.json
  const callSid = req.body.callSid;
  console.log("Request to delete callSid: ", callSid);

  // delete session from cr-sessions.json
  const sessions = new FSDB(`../data/cr-sessions.json`, false);
  sessions.delete(callSid);

  // delete session folder
  let deleteFolder = `../data/sessions/${callSid}`;
  await import("node:fs").then((fs) =>
    fs.rmSync(deleteFolder, { recursive: true, force: true })
  );
  res.send({ status: "success", data: { callSid: callSid } });
});

export default router;
