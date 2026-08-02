const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const serverUrl = 'https://localhost:3091';

let receivedData = [];

const serverOptions = {
  cert: fs.readFileSync('/etc/ssl/star_centra_ca.crt'), // Certificate
  key: fs.readFileSync('/etc/ssl/star_centra_ca.key'), // Private Key
};

// Create the HTTPS server
const server = https.createServer(serverOptions, (req, res) => {
  // Set necessary headers for CORS and Content-Security-Policy
  res.setHeader('Content-Security-Policy', `connect-src 'self' ${serverUrl}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle GET request for /getData
  if (req.method === 'GET' && req.url === '/getData') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(receivedData));  // Make sure to define receivedData somewhere
    return;
  }

  // Default response for other endpoints
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// Create WebSocket server attached to HTTP server
const wss = new WebSocket.Server({
  server, verifyClient: (info, done) => {    
    done(true);  // Accept the connection from any origin for now.
  }
});

wss.broadcast = function (data) {
  wss.clients.forEach(client => client.send(data));
};

// WebSocket connection
wss.on('connection', (ws) => {
  console.log('New client connected');
  // Listen for messages from the client

  ws.on('message', (message) => {
    const decodedMessage = message?.toString();  // Convert Buffer to string

    if (decodedMessage) {
      wss.broadcast(JSON.stringify(decodedMessage));
    }

    /* Store any data from connected clients
    console.log('Received: ' + decodedMessage);
    if (decodedMessage?.type === 'add') {
      receivedData.push(decodedMessage);
      ws.send(`Data received and stored: ${decodedMessage}`);
    } else {
      ws.send(`Ignoring data `);
    }        
    */
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send('Welcome to the WebSocket server!');
});

// Start the server
server.listen(3091, () => {
  console.log(`WebSocket server is running on ${serverUrl}`);
});