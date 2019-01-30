const initialState = {
  serverAccount: '',
  serverBalance: 0,
  clientSubmitted: false,
  serverRecieved: false,
  serverSubmitted: false,
  serverComplete: false
};

const SocketReducer = (state = initialState, action) => {
  if (action.type === 'SERVER_ACCOUNT') {
    return Object.assign({}, state, action.payload);
  }

  if (action.type === 'BOUNCE_BEGIN') {
    return Object.assign({}, state, action.payload);
  }

  if (action.type === 'BOUNCE_SENT') {
    return Object.assign({}, state, action.payload);
  }

  if (action.type === 'BOUNCE_RESPONSE') {
    return Object.assign({}, state, action.payload);
  }

  return state;
};

export default SocketReducer;
