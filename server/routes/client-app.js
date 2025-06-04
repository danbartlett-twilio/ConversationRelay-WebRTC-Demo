import express from "express";
const router = express.Router();
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

router.use(cors()); // Enable CORS for all routes
router.use(express.json()); // for parsing application/json

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

router.get('/app', (req, res) => {
  console.log("/client/app and dirname ==> ", __dirname);
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

export default router;