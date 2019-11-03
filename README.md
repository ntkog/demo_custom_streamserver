# Prerequisites

- [NGROK](https://ngrok.com/) for tunneling local connetions and expose the StreamServer to Internet.
- [NodeJS](https://nodejs.org/en/download/)

# Instructions

## Clone this repo

```bash
git clone
cd demo_custom_streamserver
```

## Install **NodeJS** dependencies

### For **custom streamserver**

```bash
npm i
```

### For **websocket server** (In *ws_server* folder)

```bash
cd ws_server
npm i
```

## Edit **SERVICE_CONF** in *index.js* with proper data.

```js
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
```

## Start **ngrok** tunneling on port **9000**

```bash
ngrok http 9000
```

> **Copy the *ngrok dynamic domain*** (It will be where the server will be exposed to the internet)

![how to copy ngrok dynamic domain](https://media.giphy.com/media/SvuX9vnv9UMuwiGCDg/giphy.gif)

## Start **websocket server**

```bash
cd ws_server
node track_timeslot.js 8001
```

> In this example, **8001** is the port you've already configure in **SERVICE_CONF**

## Start **custom streamserver**

```bash
NGROK=fa4a3c52.ngrok.io node index.js "4.13"
```

> Replace **fa4a3c52.ngrok.io** with your *ngrok dynamic domain*

![start custom streamserver](https://media.giphy.com/media/hqZbk4UxU2qrMXIPga/giphy.gif)


## Enjoy! :-)
