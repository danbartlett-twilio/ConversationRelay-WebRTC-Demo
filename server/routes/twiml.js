import express from "express";
const router = express.Router();
import { setupCallPostHandler } from '../lib/setup-call-post-handler.mjs';

/**
 * Twilio will send a POST request to this endpoint when estabilishing a call
 * Twilio expects a TwiML response to be sent back to it 
 */ 
router.post('/', async (req, res) => {
  console.log("POST /twiml => ", req.body);
  try {
    
    // Parse BODY of request to extract Call Details
    console.log("Twilio Body: ", JSON.stringify(req.body));
    const twilioBody = req.body;

    // Call the setupCallPostHandler function to dynamically generate the 
    // TwiML needed for this Csession handle the Twilio request and return a TwiML response    
    const twimlResponse = await setupCallPostHandler(twilioBody);
    console.log("TwiML Response: ", twimlResponse);

    res.status(200).type('application/xml').send(twimlResponse);

  } catch (error) {
    console.error("Error in POST /twiml => ", error);
    res.status(500).send("An error occurred while processing your request.");
  }
  
});

export default router;