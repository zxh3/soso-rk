import { combineReducers } from 'redux';

// app reducer
const appInitState = {
  prohibitTags: []
}

const appReducer = (state=appInitState, action) => {
  switch (action.type) {
    case 'TOGGLE_PROHIBIT_TAG':
      if (!state.prohibitTags.find(tagName => tagName === action.tagName)) {
        return Object.assign({}, state, {
          prohibitTags: [action.tagName, ...state.prohibitTags]
        });
      } else {
        return Object.assign({}, state, {
          prohibitTags: state.prohibitTags.filter(tagName => tagName !== action.tagName)
        });
      }
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