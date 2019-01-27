const initialState = {
  accountsReady: false,
  accounts: [],
  selectedAccount: '',
  balance: 0
};

const AccountReducer = (state = initialState, action) => {
  if (action.type === 'WEB3_INITIALIZED') {
    return Object.assign({}, state, {
      accounts: action.payload.accounts,
      selectedAccount: action.payload.accounts[0],
      accountsReady: !!action.payload.accounts.length,
      balance: action.payload.balance
    });
  }

  if (action.type === 'ACCOUNT_CHANGE') {
    return Object.assign({}, state, {
      selectedAccount: action.payload.currentAccount
    });
  }

  if (action.type === 'ACCOUNT_LOGOUT') {
    return Object.assign({}, state, {
      accountsReady: false,
      selectedAccount: '',
      accounts: [],
      balance: 0
    });
  }

  return state;
};

export default AccountReducer;
