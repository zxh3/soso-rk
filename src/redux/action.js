export const changeAuthState = (authUser) => {
  return {
    type: 'CHANGE_AUTH_STATE',
    authUser
  };
}

export const actionToggleProhibitTag = (tagName) => {
  return {
    type: 'TOGGLE_PROHIBIT_TAG',
    tagName
  };
}