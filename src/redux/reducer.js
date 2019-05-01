import { combineReducers } from 'redux';

// app reducer
const appInitState = {
  dummy: null
}

const appReducer = (state=appInitState, action) => {
  switch (action.type) {
    default:
      return state;
  }
}

// auth reducer
const authInitState = {
  authUser: null,
  loading: true,
}

const authReducer = (state=authInitState, action) => {
  switch (action.type) {
    case 'CHANGE_AUTH_STATE':
      return Object.assign({}, state, {
        authUser: action.authUser,
        loading: false,
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer
});

export default rootReducer;