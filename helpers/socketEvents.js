let lineHistory = [];

module.exports = (io) => {
  console.log('[START]:[SOCKET]');
  io.on('connection', (socket) => {
    // console.log('[SOCKET]:[USER]:[CONNECTED]');
    socket.on('subscribe_timer', (room) => {
      socket.join(room);
    });

    socket.on('new message', (conversation) => {
      console.log(`[NEW_MESSAGE]:[${JSON.stringify(conversation)}]`);
      io.sockets.in(conversation).emit('refresh messages', conversation);
    });

    socket.on('disconnect', () => {
      console.log('[SOCKET]:[USER]:[DISCONNECTED]');
    });
    
  });
};
