export const changeAuthState = (authUser) => {
  return {
    type: 'CHANGE_AUTH_STATE',
    authUser
  };
}