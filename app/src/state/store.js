// import { browserHistory } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { combineReducers } from 'redux';

import pga from 'state/reducers/pga.reducer';
import team from 'state/reducers/team.reducer';

const reducer = combineReducers({
  pga,
  team
});

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

export default store;
