var io = require('socket.io');
// const dataFetch = require('./data');

module.exports = function startIo(server) {
  io = io.listen(server);

  io.on('connection', async socket => {
    // setup
    io.emit('setup', { hello: 'world' });

    // events
    socket.on('update', data => {
      console.log('update');
    });
  });

  return io;
};
