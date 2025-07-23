# ConversationRelay WebRTC Demo

## [Read the Twilio blog that goes with this repo: Add Voice AI to your website with the Twilio Voice JavaScript SDK and ConversationRelay]( https://www.twilio.com/en-us/blog/developers/tutorials/product/voice-ai-conversationrelay-twilio-voice-sdk ) 

## Setup Instructions

1) Clone or Download the repo

2) Build the client =>  `cd client; npm install; npm run build`

3) Start ngrok (port 3000), copy your ngrok url

4) Create a Twilio API Key

5) Create a Twilio TwiML APP and point the url to POST to your ngrok url + "/twiml" (https://your-subdomain.ngrok.app/twiml)

6) Copy the file server/start-local-server.sh.sample to server/start-local-server.sh => `cp server/start-local-server.sh.sample server/start-local-server.sh` and set YOUR environment variables in `server/start-local-server.sh`

7) Make a copy of the user.json file => `cp data/users.json.sample data/users.json`

8) Start server => `cd server; npm install; ./start-local-server.sh`

9) Point your web browser to http://localhost:3000, and start working with ConversationRelay! 


## Bonus Material

### Break it down for me – how do I add an AI application to my website and app?

With this repo, you can deploy a sample application that connects a WebRTC client to a Voice Application using Twilio. You can certainly use this code as a starting point to building your own application. From a high level this application (1) registers as voice client, (2) starts a ConversationRelay session, and (3) handles inbound and outbound websockets to orchestrate text  If you want to dig into the code, here is where you should start::

### For Registering a Voice Client

* /client/src/ui-components/Main.js → contains key functions to register a voice client and make a voice call.
* /client/src/ui-components/StartCard.js → contains the TALK-TO-AGENT button.
* /server/services/twilio-service.cjs, /server/routes/client-token.js → backend functions used to register voice clients.

### For Starting a ConversationRelay Session

* /server/lib/setup-call-post-handler → Generates TwiML needed to start a ConversationRelay session.

### For Handling Inbound Websockets (Text-to-Speect), LLM Interaction and stream text back to Twilio over websockets (Speech-to-Text)

* /server/lib/default-websocket-handler.mjs → Primary handler from websocket messages coming from Twilio ConversationRelay.
* /server/lib/prepare-and-call-llm.mjs → Function used to initially call to LLM.

There are of course other key files that make this a working application, but the files listed above handle the core functionality needed to connect your voice AI applications.
