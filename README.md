# Project Setup

This repository contains a client and server application that integrates with Twilio for voice/messaging functionality.

## Prerequisites

- Node.js and npm installed
- ngrok installed
- Twilio account

## Setup Instructions

### 1. Configure Client Environment

```bash
cp client/env.sample client/.env
```

### 2. Build Client

```bash
cd client
npm install
npm run build
cd ..
```

### 3. Start ngrok

```bash
ngrok http 3000
```

Copy the ngrok URL for the next steps.

### 4. Configure Twilio

1. Create a Twilio API Key in your Twilio Console
2. Create a Twilio TwiML App
3. Set the webhook URL to: `https://your-subdomain.ngrok.app/twiml` (POST method)

### 5. Configure Server Environment

```bash
cp server/start-local-server.sh.sample server/start-local-server.sh
```

Edit `server/start-local-server.sh` and set your environment variables.

### 6. Start Server

```bash
cd server
npm install
chmod +x start-local-server.sh
./start-local-server.sh
```

### 7. Access Application

Open your browser to:

```
http://localhost:3000
```

Monitor the terminal window and check the `data` directory for activity.
