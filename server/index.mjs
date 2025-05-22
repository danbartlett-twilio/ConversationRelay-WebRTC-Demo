import express from "express";
import clientRoutes from './routes/client.js';
import twimlRoutes from './routes/twiml.js';
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import url from 'url';
import { fileURLToPath } from 'url';
import { WebSocketServer } from "ws";
import { defaultWebsocketHandler as websocketTwilioEventsHandler } from './lib/default-websocket-handler.mjs';

// Initialize the Express app and websocket server

const app = express();
const port = 3000;
const wsServer = new WebSocketServer({ noServer: true });
const server = app.listen(port, () => {
  console.log(`App is ready.`);    
  console.debug(`WS_URL => ${process.env.WS_URL}`);
  console.debug(`AI_PLATFORM => ${process.env.AI_PLATFORM}`);
});

// Needed to access the client application
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
app.use(express.static(path.join(__dirname, '../client/build'))); // Serve static files from the React app

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// REST routes
app.use('/client', clientRoutes); // Points to the client app in client/build
app.use('/twiml', twimlRoutes); // TwiML App points here when the client calls
app.get('/health', (req, res) => {  res.send('Healthy'); }); // Health check endpoint for load balancers

// Handle WebSocket Connection Established by Twilio ConversationRelay
server.on('upgrade', (request, socket, head) => {
  
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    
    // Get the Twilio callSid to use as session ID for the WebSocket connection
    const URLparams = url.parse(request.url, true).query;
    console.log("URLparams => ", URLparams);
    if(URLparams.callSid) {      
      request.callSid = URLparams.callSid;
      wsServer.emit('connection', socket, request, head);
    } else {
      console.error('No requestId found in the request URL');
      socket.terminate();
    }
  })
});

function heartbeat() {
  this.isAlive = true;
  console.log("Heartbeat received");
}

const interval = setInterval(function ping() {
  wsServer.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// Handler functions for post WS connection
wsServer.on('connection', (socket, request, head) => {
  socket.isAlive = true;
  
  // Message handler for Twilio incoming messages
  // THIS METHOD MUST NOT BE ASYNC - ONLY THE ONMESSAGE HANDLER CAN BE ASYNC
  
  // Session Key is the callSid passed in the URL and from Twilio
  const callSid = request.callSid;  
  
  socket.on('message', async (message) => {
    
    // Parse the incoming message from Twilio
    const messageJSON = JSON.parse(message.toString());
    
    let toolCallCompletion = false; // False because tool call completion events do not come this way
    
    console.info("EVENT\n" + JSON.stringify(messageJSON, null, 2)); 
    console.info(`In onMessage handler: callSid: ${callSid}`);

    try {
      
      // Primary handler for messages from Twilio ConversationRelay
      await websocketTwilioEventsHandler(callSid, socket, messageJSON, toolCallCompletion); 

    } catch (error) {

        console.log("Message processing error => ", error);
    }  
  });
  
  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  
  socket.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
  
  socket.on('ping', heartbeat);

});



