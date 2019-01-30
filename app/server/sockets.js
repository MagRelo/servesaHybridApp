var io = require('socket.io');

const getWeb3 = require('./utils/getWeb3');

module.exports = function startIo(server) {
  io = io.listen(server);

  io.on('connection', async socket => {
    // console.log('socket connected:', socket.id);

    // setup
    io.emit('server-account', await getServerAccount());

    // events
    socket.on('bounce-txn', async data => {
      // console.log('bounce-txn', data);

      // on received
      await timeout(2000);
      io.emit('bounce-response', { serverRecieved: true });

      // submitted to blockchain
      await timeout(2000);
      io.emit('bounce-response', { serverSubmitted: true });

      // transaction result
      await timeout(2000);
      io.emit('bounce-response', { serverComplete: true });
    });
  });

  return io;
};

async function submitTxn() {
  // test web3
  const { serverAccount, serverAccountBalance } = await getWeb3.getWeb3();

  return { serverAccount, serverAccountBalance };
}

async function getServerAccount() {
  // test web3
  const { serverAccount, serverAccountBalance } = await getWeb3.getWeb3();

  return { serverAccount: serverAccount.address, serverAccountBalance };
}

// debug
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
