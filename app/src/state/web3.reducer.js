const initialState = {
  web3Ready: false,
  instance: null,
  networkReady: false,
  network: '',

  accountsReady: false,
  accounts: [],
  currentAccount: '',
  balance: 0,

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
      balance: action.payload.balance,
      networkReady: !!action.payload.network,
      accounts: action.payload.accounts,
      accountsReady: !!action.payload.accounts.length
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
