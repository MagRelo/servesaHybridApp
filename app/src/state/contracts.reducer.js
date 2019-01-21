const initialState = {
  bouncer: null
};

const AccountReducer = (state = initialState, action) => {
  if (action.type === 'CONTRACTS_INITIALIZED') {
    return Object.assign({}, state, {
      bouncer: action.payload.bouncer,
      contractsReady: true
    });
  }

  return state;
};

export default AccountReducer;
