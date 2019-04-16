export const changeAuthState = (authUser) => {
  return {
    type: 'CHANGE_AUTH_STATE',
    authUser
  };
}

export const changeMainMenuActiveItem = (mainMenuActiveItem) => {
  return {
    type: 'CHANGE_MAIN_MENU_ACTIVE_ITEM',
    mainMenuActiveItem
  };
}