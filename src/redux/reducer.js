import { combineReducers } from 'redux';

// dummy reducer
const appInitState = {
  mainMenuActiveItem: 'Trending'
}

const appReducer = (state=appInitState, action) => {
  switch (action.type) {
    case 'CHANGE_MAIN_MENU_ACTIVE_ITEM':
      return Object.assign({}, state, {
        mainMenuActiveItem: action.mainMenuActiveItem
      });
    default:
      return state;
  }
}

// auth reducer
const authInitState = {
  authUser: null
}

const authReducer = (state=authInitState, action) => {
  switch (action.type) {
    case 'CHANGE_AUTH_STATE':
      return Object.assign({}, state, {
        authUser: action.authUser
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