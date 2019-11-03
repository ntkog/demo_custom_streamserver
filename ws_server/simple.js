const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000 });
var DATA = require('./data.json');

wss.on('connection', function connection(ws) {
  // ws is client(browser) connected to our server
  ws.on('message', function incoming(message) {
    // when browser send us a message
    console.log('received: %s', message);
  });
});

// Broadcast message to all connected clients (wss.clients) every 1000 ms
setInterval((data) => {
  let message = data.shift();
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
},1000,DATA);
