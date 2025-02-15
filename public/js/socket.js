// import { WEBSOCKET_URL } from '../../pu'

// if (!WEBSOCKET_URL) {
//   throw new Error('Forgot to initialze some variables')
// }

const WEBSOCKET_URL = "wss://mujomegle.com";

WebSocket.prototype.init = function () {
  this.channels = new Map()
  this.addEventListener('message', (message) => {
    const { channel, data } = JSON.parse(message.data.toString())
    this.propagate(channel, data)
  })
}

WebSocket.prototype.emit = function (channel, data) {
  this.send(JSON.stringify({ channel, data }))
}

WebSocket.prototype.register = function (channel, callback) {
  this.channels.set(channel, callback)
}

WebSocket.prototype.propagate = function (channel, data) {
  const callback = this.channels.get(channel)
  if (!callback) return
  callback(data)
}

export const createSocket = async () => {
  return new Promise(resolve => {
    const ws = new WebSocket(WEBSOCKET_URL)
    ws.addEventListener("error", (event) => {
      console.log("WebSocket error: ", event);
    });
    ws.addEventListener('open', async () => {
      ws.init()

      setInterval(function () {
        if (ws.readyState === WebSocket.OPEN) {
          ws.emit('peopleOnline')
        }
      }, 30000)

      resolve(ws)
    })
  })
}
