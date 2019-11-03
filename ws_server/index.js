const WebSocket = require('ws');
const fetch = require('node-fetch');
const jsonfile = require('jsonfile');
const wss = new WebSocket.Server({ port: 8000 });
const URL = "https://datosabiertos.malaga.eu/recursos/transporte/EMT/EMTlineasUbicaciones/lineasyubicaciones.geojson";
const TRACKING_LINES = [72];
const TRACKING_BUSES = [706];
const REFRESH_TIME = 60000;
const POSITIONS_TO_TRACK = 60;
var POSITIONS = [];
const STATIONS_FILENAME = './stations.json';

function broadcast(payload) {
  console.log(payload);
  try {
    let msg = JSON.stringify(payload);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  } catch(err) {
    console.error(`Cannot serialize message`);
  }
}

function pickPayload(msgs,buses) {
  return msgs
          .filter(obj => buses.length === 0 ? true : buses.includes(parseInt(obj.properties.codBus)))
          .map(msg => {
            let {geometry, properties} = msg;
            return {
              lat: parseFloat(geometry.coordinates[1]),
              lon: parseFloat(geometry.coordinates[0]),
              ...properties,
              codLinea : parseInt(properties.codLinea),
              codBus : parseInt(properties.codBus)
            }
          })
}

function stopAndSaveRoutes () {
  clearInterval(fetchIntervalId);
  jsonfile.writeFile(STATIONS_FILENAME, [].concat(...POSITIONS))
    .then(res => {
      console.log('Write complete');
      process.exit(0);
    })
    .catch(error => console.error(error))
}


var fetchIntervalId = setInterval(async () => {
  if (POSITIONS.length < POSITIONS_TO_TRACK) {
    let messages = await fetch(URL)
        .then(res => res.json())
        .catch((err) => console.log(err));
    let payloadArr = pickPayload(messages,TRACKING_BUSES);
    POSITIONS.push(payloadArr);
    payloadArr.map(el => broadcast(el));
  } else {
    stopAndSaveRoutes();
  }
},REFRESH_TIME);
