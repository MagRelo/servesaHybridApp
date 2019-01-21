// import { browserHistory } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { combineReducers } from 'redux';

import web3 from 'state/web3.reducer';
import account from 'state/account.reducer';
import contracts from 'state/contracts.reducer';

const reducer = combineReducers({
  web3,
  account,
  contracts
});

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

export default store;
