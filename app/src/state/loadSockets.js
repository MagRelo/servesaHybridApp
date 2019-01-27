import io from 'socket.io-client';
import store from 'state/store';

let socket = null;

export async function initSockets() {
  socket = io('/');
  socket.on('connect', () => {
    console.log('socket connected:', socket.id);
  });

  // standard errors
  socket.on('reconnecting', reconnectError);
  socket.on('error', socketError);
  socket.on('disconnect', socketError);
  socket.on('connect_failed', socketError);
  socket.on('reconnect_failed', socketError);

  // servesa events
  socket.on('setup', updateServerData);

  return true;
}

// socket handlers
async function updateServerData(data) {
  return store.dispatch({
    type: 'SOCKET_DATA',
    payload: data
  });
}

function socketError(error) {
  console.error('socket error!', error);
}

function reconnectError(data) {
  if (data > 5) {
    socket.disconnect();
    console.log('disconnecting');
  } else {
    console.log('reconnection attempts: ', data);
  }
}

export async function sendData() {
  socket.emit('bounce-txn', { party: 'time' });
}
