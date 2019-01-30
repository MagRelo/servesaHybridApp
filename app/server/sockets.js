var io = require('socket.io');

const getWeb3 = require('./utils/getWeb3');

const bpArtifact = require('../src/contracts/BouncerProxy.json');

module.exports = function startIo(server) {
  io = io.listen(server);

  io.on('connection', async socket => {
    // console.log('socket connected:', socket.id);

    // setup
    io.emit('server-account', await getServerAccount());

    // events
    socket.on('bounce-txn', async data => {
      // received...
      io.emit('bounce-response', { serverRecieved: true });

      // check input data
      const signature = data.signature;
      const signingAccount = data.selectedAccount;
      const targetContractAddress = data.targetContractAddress;
      const targetContractValue = 0;
      const txnData = data.txnData;
      const rewardAddress = '0x0000000000000000000000000000000000000000';
      const rewardAmount = 0;

      // setup contract
      const { web3, networkId, serverAccount } = await getWeb3.getWeb3();
      const BouncerProxy = await new web3.eth.Contract(
        bpArtifact.abi,
        bpArtifact.networks[networkId].address
      );

      try {
        // submitting...
        io.emit('bounce-response', { serverSubmitted: true });

        // send transaction
        const receipt = await BouncerProxy.methods
          .forward(
            signature,
            signingAccount,
            targetContractAddress,
            targetContractValue,
            txnData,
            rewardAddress,
            rewardAmount
          )
          .send({ from: serverAccount.address });

        // transaction result
        io.emit('bounce-response', { serverComplete: true, receipt });
      } catch (error) {
        console.log(error);
        io.emit('bounce-response', {
          serverError: true,
          errorMessage: error.message
        });
      }
    });
  });

  return io;
};

async function getServerAccount() {
  // test web3
  const { serverAccount, serverAccountBalance } = await getWeb3.getWeb3();

  return { serverAccount: serverAccount.address, serverAccountBalance };
}

// debug
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
