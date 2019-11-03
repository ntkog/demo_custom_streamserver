// Install it from github
// npm i https://github.com/ntkog/arcgis-websockets-streamserver.git
const streamServer = require('arcgis-websockets-streamserver');

const SERVICE_CONF = {
  name : "test",
  out_sr : {
    wkid : 102100,
    latestWkid : 3857
  },
  port : process.env["NGROK"] ? 9000 : 9000,
  host : process.env["NGROK"]  || "localhost",
  protocol : process.env["NGROK"] ? "https" : "http",
  wsUrl : "ws://localhost:8001"
};

streamServer.start(SERVICE_CONF)
  .then(() => console.log("Initialized successfully"))
  .catch((err) => {
    console.log(`Initialization failed! reason : [${err}]`);
    process.exit(12);
  });
