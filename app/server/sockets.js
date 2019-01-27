var io = require('socket.io');
// const dataFetch = require('./data');

module.exports = function startIo(server) {
  io = io.listen(server);

  io.on('connection', async socket => {
    console.log('socket connected:', socket.id);

    // setup
    io.emit('setup', { hello: 'world' });

    // events
    socket.on('bounce-txn', data => {
      console.log('bounce-txn', data);
    });
  });

  return io;
};
