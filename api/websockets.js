const socketio = require('socket.io')

const handlers = []
function addHandler (event, callback) {
  handlers.push({ event, callback })
}

let io
function listen (server) {
  io = socketio(server)
  io.on('connection', onConnect)
}

function onConnect (socket) {
  console.log(`[${socket.id}] Connected`)
  socket.on('disconnect', () => onDisconnect(socket))

  handlers.forEach(({ event, callback }) => {
    socket.on(event, message => callback(message, socket, io))
  })
}

function onDisconnect (socket) {
  console.log(`[${socket.id}] Disconnected`)
}

function sendMessage (type, message) {
  io.emit(type, message)
}

module.exports = { addHandler, listen, sendMessage }
