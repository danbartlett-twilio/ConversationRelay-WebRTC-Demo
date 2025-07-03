# ConversationRelay WebRTC Demo

## [Read the Twilio blog that goes with this repo: Add Voice AI to your website with the Twilio Voice JavaScript SDK and ConversationRelay]( https://www.twilio.com/blog/voice-ai-conversationrelay-twilio-voice-sdk) 

## Setup Instructions

1) Clone or Download the repo

2) Build the client =>  `cd client; npm install; npm run build`

3) Start ngrok (port 3000), copy your ngrok url

4) Create a Twilio API Key

5) Create a Twilio TwiML APP and point the url to POST to your ngrok url + "/twiml" (https://your-subdomain.ngrok.app/twiml)

6) Copy the file server/start-local-server.sh.sample to server/start-local-server.sh => `cp server/start-local-server.sh.sample server/start-local-server.sh.sample` and set YOUR environment variables in `server/start-local-server.sh`

7) Make a copy of the user.json file => `cp data/users.json.sample data/users.json`

8) Start server => `cd server; npm install; ./start-local-server.sh`

9) Point your web browser to http://localhost:3000, and start working with ConversationRelay! 
