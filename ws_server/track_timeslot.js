const WebSocket = require('ws');
const fetch = require('node-fetch');
const jsonfile = require('jsonfile');
const PORT = process.argv[2] || 8000;
const wss = new WebSocket.Server({ port: parseInt(PORT) });
const TRACKING_BUS = [505,645,704,712];
const REFRESH_TIME = 2000;

const DATA = require('./stations_60m.json');
console.log(`tracking buses : ${TRACKING_BUS}`);

function broadcast(payload) {
  try {
    let msg = JSON.stringify(payload);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
        console.log("...");
      }
    });
  } catch(err) {
    console.error(`Cannot serialize message`);
  }
}

var fetchIntervalId;

fetchIntervalId = setInterval(async (list) => {
    let POSITIONS;
    if(list.clients.size > 0) {
      if (DATA.length > 0) {
        POSITIONS = DATA.shift();

        POSITIONS
          //.filter(bus => TRACKING_BUS.includes(parseInt(bus.codBus)))
          .map(bus => broadcast(bus));
        //broadcast(POSITIONS);
      } else {
        clearInterval(fetchIntervalId);
      }
    }
},REFRESH_TIME, wss);
