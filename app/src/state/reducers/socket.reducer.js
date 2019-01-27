const initialState = {
  events: []
};

const SocketReducer = (state = initialState, action) => {
  if (action.type === 'SOCKET_DATA') {
    const events = [action.payload, ...state.events];
    return Object.assign({}, state, {
      events: events
    });
  }

  return state;
};

export default SocketReducer;
