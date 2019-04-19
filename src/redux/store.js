import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer';

import { auth } from '../firebase';
import { changeAuthState } from './action';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));

auth.onAuthStateChanged((authUser) => {
  store.dispatch(changeAuthState(authUser));
});

export default store;