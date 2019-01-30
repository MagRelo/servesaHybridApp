import io from 'socket.io-client';
import store from 'state/store';

import ethUtil from 'ethereumjs-util';

const { soliditySha3 } = require('web3-utils');

let socket = null;

export async function bounceTransaction(contract, method, params, amount) {
  // get web3 and contracts
  const web3 = store.getState().web3.instance;
  const bouncerProxyInstance = store.getState().contracts.bouncerProxy;
  const selectedAccount = store.getState().account.selectedAccount;

  console.log(selectedAccount);

  // build txn data
  const targetContract = store.getState().contracts[contract];
  const txnData = targetContract.methods[method](...params).encodeABI();
  const accountNonce = await bouncerProxyInstance.methods
    .nonce(selectedAccount)
    .call({ from: selectedAccount });

  // test vars
  const rewardAmount = 0;
  const rewardAddress = '0x0000000000000000000000000000000000000000';

  // hash & sign message
  const parts = [
    bouncerProxyInstance._address,
    selectedAccount,
    targetContract._address,
    web3.utils.toTwosComplement(amount),
    txnData,
    rewardAddress,
    web3.utils.toTwosComplement(rewardAmount),
    web3.utils.toTwosComplement(accountNonce)
  ];
  const message = soliditySha3(...parts);
  const contentAsHex = ethUtil.bufferToHex(new Buffer(message, 'utf8'));

  // sign transaction
  try {
    web3.currentProvider.sendAsync(
      {
        method: 'personal_sign',
        params: [contentAsHex, selectedAccount],
        from: selectedAccount
      },
      async (error, response) => {
        if (error) return console.error(error);
        if (response.error) {
          return console.log('User denied signature');
        }

        // send to server
        const signature = response.result;
        socket.emit('bounce-txn', {
          signature,
          selectedAccount,
          targetContractAddress: targetContract._address,
          txnData
        });

        // set loading state
        store.dispatch({
          type: 'BOUNCE_SENT',
          payload: {
            clientSubmitted: true,
            serverRecieved: false,
            serverSubmitted: false,
            serverComplete: false,
            serverError: false,
            errorMessage: ''
          }
        });
      }
    );
  } catch (error) {
    console.log(error.message);
  }

  return;
}

// export async function sendData(eventType, data) {
//   store.dispatch({
//     type: 'BOUNCE_SENT',
//     payload: {
//       clientSubmitted: true,
//       serverRecieved: false,
//       serverSubmitted: false,
//       serverComplete: false
//     }
//   });

//   socket.emit(eventType, data);
// }

export async function initSockets() {
  socket = io('/');
  socket.on('connect', () => {
    console.log('socket connected:', socket.id);
  });

  // servesa events
  socket.on('server-account', updateServerData);
  socket.on('bounce-response', bounceResponse);

  // standard errors
  socket.on('reconnecting', reconnectError);
  socket.on('error', socketError);
  socket.on('disconnect', socketError);
  socket.on('connect_failed', socketError);
  socket.on('reconnect_failed', socketError);

  return true;
}

// socket handlers
async function updateServerData(data) {
  return store.dispatch({
    type: 'SERVER_ACCOUNT',
    payload: data
  });
}

async function bounceResponse(data) {
  return store.dispatch({
    type: 'BOUNCE_RESPONSE',
    payload: data
  });
}

// standard errors

function reconnectError(data) {
  if (data > 5) {
    socket.disconnect();
    console.log('disconnecting');
  } else {
    console.log('reconnection attempts: ', data);
  }
}
function socketError(error) {
  console.error('socket error!', error);
}
