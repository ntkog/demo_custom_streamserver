const WebSocket = require('ws');
const fetch = require('node-fetch');
const PORT = process.argv[2] || 8000;
const wss = new WebSocket.Server({ port: PORT });
const URL = "https://datosabiertos.malaga.eu/recursos/transporte/EMT/EMTlineasUbicaciones/lineasyubicaciones.geojson";
const TRACKING_LINES = [72,63];
const REFRESH_TIME = 1000;

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

function pickPayload(msgs,lines) {
  return msgs
          .filter(obj => lines.length === 0 ? true : lines.includes(parseInt(obj.properties.codLinea)))
          .map(msg => {
            let {geometry, properties} = msg;
            return {
              lat: parseFloat(geometry.coordinates[1]),
              lon: parseFloat(geometry.coordinates[0]),
              ...properties,
              codLinea : parseInt(properties.codLinea),
              codBus : parseInt(properties.codBus),
              ObjectID : parseInt(properties.codBus)
            }
          })
}


var fetchIntervalId = setInterval(async () => {
  let messages = await fetch(URL)
      .then(res => res.json())
      .catch((err) => console.log(err));
  let payloadArr = pickPayload(messages,TRACKING_LINES);
  payloadArr.map(bus => broadcast(bus));

},REFRESH_TIME);
