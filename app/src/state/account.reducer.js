const initialState = {
  accountsReady: false,
  accounts: [],
  currentAccount: '',
  balance: 0
};

const AccountReducer = (state = initialState, action) => {
  if (action.type === 'WEB3_INITIALIZED') {
    return Object.assign({}, state, {
      accounts: action.payload.accounts,
      currentAccount: action.payload.accounts[0],
      accountsReady: !!action.payload.accounts.length,
      balance: action.payload.balance
    });
  }

  if (action.type === 'ACCOUNT_CHANGE') {
    return Object.assign({}, state, {
      currentAccount: action.payload.currentAccount
    });
  }

  return state;
};

export default AccountReducer;
