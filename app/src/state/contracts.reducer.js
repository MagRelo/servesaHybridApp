const initialState = {
  bouncerProxy: null,
  contractsReady: false
};

const AccountReducer = (state = initialState, action) => {
  if (action.type === 'CONTRACTS_INITIALIZED') {
    return Object.assign({}, state, {
      bouncerProxy: action.payload.bouncerProxy,
      contractsReady: action.payload.contractsReady
    });
  }

  return state;
};

export default AccountReducer;
