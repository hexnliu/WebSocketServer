# WebSocket Server

A lightweight HTTPS WebSocket server built with Node.js that enables real-time communication between multiple connected clients.

The server accepts secure WebSocket (WSS) connections, broadcasts incoming messages to all connected clients, and exposes a simple REST endpoint for retrieving stored data.

---

# Features

* Secure HTTPS server
* Secure WebSocket (WSS) communication
* Broadcast messages to all connected clients
* Simple REST API endpoint
* CORS enabled
* Easy deployment
* Minimal dependencies

---

# Project Structure

```
.
├── webSocket.js          # Main WebSocket server
├── package.json
├── package-lock.json
└── README.md
```

---

# Requirements

* Node.js 18+ (recommended)
* npm
* SSL certificate
* SSL private key

---

# Installation

Clone the repository

```bash
git clone https://github.com/yourusername/websocket-server.git

cd websocket-server
```

Install dependencies

```bash
npm install
```

---

# Dependencies

This project currently uses:

```
ws
```

which is installed automatically using

```bash
npm install
```

---

# SSL Certificates

The server requires an SSL certificate and private key.

Current configuration:

```javascript
cert: /etc/ssl/star_centra_ca.crt
key: /etc/ssl/star_centra_ca.key
```

Modify these paths in `webSocket.js` if your certificates are stored elsewhere.

---

# Running the Server

Start the server

```bash
node webSocket.js
```

You should see

```
WebSocket server is running on https://localhost:3091
```

---

# Server Configuration

Default Port

```
3091
```

Server URL

```
https://localhost:3091
```

---

# REST API

## GET /getData

Returns all stored data.

### Request

```
GET https://localhost:3091/getData
```

### Response

```json
[
    ...
]
```

> Note:
>
> The current implementation initializes an empty `receivedData` array. The code responsible for storing received messages is commented out, so this endpoint currently returns an empty array unless that logic is enabled.

---

# WebSocket Usage

Connect using any WebSocket client.

Example URL

```
wss://localhost:3091
```

Example JavaScript

```javascript
const socket = new WebSocket("wss://localhost:3091");

socket.onopen = () => {
    console.log("Connected");

    socket.send("Hello Server");
};

socket.onmessage = (event) => {
    console.log(event.data);
};

socket.onclose = () => {
    console.log("Disconnected");
};
```

---

# Broadcasting

Whenever a client sends a message, the server broadcasts that message to every connected client.

Example

Client A sends

```
Hello Everyone
```

All connected clients receive

```
"Hello Everyone"
```

---

# Current Behavior

When a client connects

* Client receives

```
Welcome to the WebSocket server!
```

When a client disconnects

```
Client disconnected
```

When a client sends a message

* Server broadcasts the message to every connected client.

---

# Security Notes

Current implementation accepts connections from all origins.

```javascript
verifyClient: (info, done) => {
    done(true);
}
```

For production deployments, it is recommended to:

* Restrict allowed origins
* Implement authentication
* Use JWT or API keys
* Add rate limiting
* Validate incoming messages
* Log connection activity

---

# Future Improvements

* Authentication
* User sessions
* Message persistence
* Heartbeat / Ping-Pong support
* Reconnection handling
* Rooms / Channels
* Message history
* Logging
* Configuration using environment variables
* Docker support

---

# License

ISC
