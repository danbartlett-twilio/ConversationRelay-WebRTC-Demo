import express from "express";
const router = express.Router();
import cors from "cors";
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
  res.send('hello');
});


router.get("/get-users", async (req, res) => {
  const users = new FSDB(`../data/users.json`, false);
  const allUsers = users.getAll();
  res.send(allUsers);
});

// URI:  <server>/client-data/update-user
// Method: GET
// Description: This route updates specific user from data passed in the request.
router.post("/update-user", async (req, res) => {
    const users = new FSDB(`../data/users.json`, false);
    // Here you would typically update the user based on some criteria
    // For now, we will just return the users

    const userIdentity = req.body.identity
    users.set(userIdentity, {

      from: req.body.from,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
            useCase : req.body.useCase,
      conversationRelayParamsOverride : 
      req.body.conversationRelayParamsOverride    
    });

  res.send({ status: "success", data: users.get(userIdentity)});
});

// URI:  <server>/client-data/get-transcription-voices
// Method: GET
// Description: This route updates specific user from data passed in the request.
router.get("/get-transcription-voices", async (req, res) => {
    const voices = new FSDB(`../data/transcription-providers.json`, false);
    const allVoices = voices.getAll();
    res.send(allVoices);
});

export default router;