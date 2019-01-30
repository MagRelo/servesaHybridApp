// import { browserHistory } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { combineReducers } from 'redux';

import web3 from 'state/reducers/web3.reducer';
import account from 'state/reducers/account.reducer';
import contracts from 'state/reducers/contracts.reducer';
import bounce from 'state/reducers/bounce.reducer';

const reducer = combineReducers({
  web3,
  account,
  contracts,
  bounce
});

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

export default store;
