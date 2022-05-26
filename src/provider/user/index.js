import React, {useReducer, useContext, useSyncExternalStore } from 'react';
import { UserReducer } from './reducer';
import { UserContextActions,UserContext,INITIAL_STATE } from './contexts';
import {
loginOutUserRequestAction,loginUserRequestAction,updateUserRequestAction
} from './actions';


const UserProvider= ({children}) => {
  const [state, dispatch] = useReducer(UserReducer, INITIAL_STATE);

  const loginUser=({firstName, surname,isLogin}) => 
  {dispatch(loginUserRequestAction({firstName,surname,isLogin}))
};
  const loginOutUser=({isLogin})=>{
    dispatch(loginOutUserRequestAction({isLogin}));

  }
  const updateUserInfo=({firstName, surname})=>{
    dispatch(updateUserRequestAction({firstName,surname}));
  }
  /* NEW_ACTION_DECLARATION_GOES_HERE */

  return (
      
     <UserContext.Provider value={state}>
        <UserContextActions.Provider
          value={{
            loginUser,
            loginOutUser,
            updateUserInfo,
            /* NEW_ACTION_GOES_HERE */
         }} 
    >
          {children}
    </UserContextActions.Provider>
     </UserContext.Provider> 

    

  );






}

function useLoginState() {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useAuthState must be used within a AuthProvider');
    }
    return context;
  }
  
  function useLoginActions() {
    const context = useContext(UserContextActions);
    if (context === undefined) {
      throw new Error('useAuthActions must be used within a AuthProvider');
    }
    return context;
  }

  function useMain(){
    return {
      ...useLoginActions(),
      ...useLoginState()
    }
  }

export { UserProvider, useLoginActions, useLoginState,useMain };
