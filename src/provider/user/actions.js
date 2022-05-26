import { createAction } from 'redux-actions';
export const UsernActionEnums ={
    loginUserRequest: 'LOGIN_USER_REQUEST',
    loginOutUserRequest: 'LOGIN_OUT_USER_REQUEST',
    updateUserRequest: 'UPDATE_USER_REQUEST',
    /* NEW_ACTION_TYPE_GOES_HERE */
  }


  export const  loginUserRequestAction = createAction(UsernActionEnums.loginUserRequest, (userInfo) => ({...userInfo}));

  export const  loginOutUserRequestAction = createAction(UsernActionEnums.loginOutUserRequest, ({isLogin}) => ({isLogin}));

  export const  updateUserRequestAction = createAction(UsernActionEnums.updateUserRequest, (userInfo) => ({...userInfo}));
