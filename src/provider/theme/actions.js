import { createAction } from 'redux-actions';
export const PersonActionEnums ={
    changeThemerequest: 'CHANGE_THEME_REQUEST',
    /* NEW_ACTION_TYPE_GOES_HERE */
  }


  export const getPersonRequestAction = createAction(PersonActionEnums.changeThemerequest, (colorTheme) => ({colorTheme}));
