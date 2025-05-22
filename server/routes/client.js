import express from "express";
const router = express.Router();
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

import pkg from '../services/twilio-service.cjs';
const { registerVoiceClient } = pkg;

router.use(cors()); // Enable CORS for all routes
router.use(express.json()); // for parsing application/json

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

router.get('/app', (req, res) => {
  console.log("/client/app and dirname ==> ", __dirname);
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

// Route to register voice client (get token from Twilio)
router.get("/register-voice-client", async (req, res) => {
  const phone = req.query.phone;
  const identity = phone.replace(" ", "+"); //quirk passing in from UI
  const token = await registerVoiceClient(identity);
  console.log("Registered voice client");
  res.send(token.body);
});

export default router;