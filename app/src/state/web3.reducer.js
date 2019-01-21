const initialState = {
  web3Ready: false,
  instance: null,
  networkReady: false,
  network: '',

  contractsReady: false,
  contractDataReady: false,

  showTip: false
};

const web3Reducer = (state = initialState, action) => {
  if (action.type === 'WEB3_INITIALIZED') {
    return Object.assign({}, state, {
      web3Ready: true,
      instance: action.payload.instance,
      network: action.payload.network,
      networkReady: !!action.payload.network,
      networkID: action.payload.networkID
    });
  }

  if (action.type === 'UPDATE_DATA') {
    return Object.assign(
      {},
      state,
      { contractDataReady: true },
      action.payload.contracts
    );
  }

  if (action.type === 'CONTRACTS_INITIALIZED') {
    return Object.assign({}, state, {
      contractsReady: true
    });
  }

  if (action.type === 'SHOW_TIP') {
    return Object.assign({}, state, action.payload);
  }

  return state;
};

export default web3Reducer;
