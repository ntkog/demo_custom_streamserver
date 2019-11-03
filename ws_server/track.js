const WebSocket = require('ws');
const fetch = require('node-fetch');
const jsonfile = require('jsonfile');
const wss = new WebSocket.Server({ port: 8000 });
const TRACKING_BUS = [581,590,593,596];
const REFRESH_TIME = 2000;

const DATA = require('./stations.json');
//const POSITIONS = DATA.filter(el => el.codBus === TRACKING_BUS);
const POSITIONS = DATA.filter(el => TRACKING_BUS.includes(el.codBus));



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
console.log(POSITIONS);
fetchIntervalId = setInterval(async (list) => {
    if(list.clients.size > 0) {
      if (POSITIONS.length > 0) {
        broadcast(POSITIONS.shift());
      } else {
        clearInterval(fetchIntervalId);
      }
    }
},REFRESH_TIME, wss);
