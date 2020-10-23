const socketio = require('socket.io');

let io;
function listen(server) {
  io = socketio(server);
  io.on('connection', socket => {
    console.log(`[${socket.id}] Connected`);
    socket.on('disconnect', () => {
      console.log(`[${socket.id}] Disconnected`);
    });
  });
}

function sendMessage(type, message) {
  io.emit(type, message);
}

module.exports = { listen, sendMessage };
