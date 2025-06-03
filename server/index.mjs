import express from "express";
import twimlRoutes from './routes/twiml.js';
import clientRoutes from './routes/client.js';
import clientDataRoutes from './routes/client-data.js';

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
const wss = new WebSocketServer({ noServer: true });
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
app.use('/client-data', clientDataRoutes); // CRUD routes for client
app.use('/twiml', twimlRoutes); // TwiML App points here when the client calls
app.get('/health', (req, res) => {  res.send('Healthy'); }); // Health check endpoint for load balancers

// Handle WebSocket Connection Established by Twilio ConversationRelay
server.on('upgrade', (request, socket, head) => {
  
  wss.handleUpgrade(request, socket, head, (socket) => {
    
    // Get the Twilio callSid to use as session ID for the WebSocket connection
    const URLparams = url.parse(request.url, true).query;
    console.log("URLparams => ", URLparams);
    if(URLparams.callSid) {      
      request.callSid = URLparams.callSid;
      wss.emit('connection', socket, request, head);
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
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// Handler functions for post WS connection
wss.on('connection', (socket, request, head) => {
  
  // socket is the connect for the websocket for this request
  socket.isAlive = true;
  
  socket.callSid = request.callSid; // Store the callSid in the socket for later use

  // Message handler for Twilio incoming messages
  // THIS METHOD MUST NOT BE ASYNC - ONLY THE ONMESSAGE HANDLER CAN BE ASYNC
  
  // Session Key is the callSid passed in the URL and from Twilio
  const callSid = request.callSid;  
  
  socket.on('message', async (message) => {
    
    // Parse the incoming message from Twilio
    const messageJSON = JSON.parse(message.toString());
    
    let toolCallCompletion = false; // False because tool call completion events do not come this way
    
    //console.info("EVENT\n" + JSON.stringify(messageJSON, null, 2)); 
    console.info(`In onMessage handler: callSid: ${callSid}`);

    try {
      
      let clientSocket = null;
      
      if (callSid !== 'browser-client') {
        //console.info("wss.clients\n" + JSON.stringify(wss.clients, null, 2)); 
        /*wss.clients.forEach(function each(client) {        
          if (client !== socket && client.readyState === WebSocketServer.OPEN) {
              console.info("client => \n" + JSON.stringify(client, null, 2)); 
            }
        });*/
      
        // clientSocket is the socket for the browser client and used to send
        // events back to the browser client such as transcription and speaking events and metrics.
        
        for (const client of wss.clients) {
            if (client.callSid === 'browser-client') {
              clientSocket = client;  // This is the browser client socket
              break;
            }
        }

        /*const localClient = wss.clients.find(client => client.callSid === 'browser-client');
          if (localClient) {
            localClient.send(JSON.stringify({
              type: 'twilio-event',
              callSid: callSid,
              message: messageJSON
            }));
          }*/
      };

      // Primary handler for messages from Twilio ConversationRelay
      await websocketTwilioEventsHandler(callSid, socket, messageJSON, toolCallCompletion, clientSocket); 

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



