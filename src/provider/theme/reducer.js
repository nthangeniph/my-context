export function ThemeReducer(
    incomingState,
    action
  ){
  
  
    const { type, payload } = action;
    //#endregion
  
    switch (type) {
      case PersonActionEnums.GetPersonRequest:
      case PersonActionEnums.GetPersonSuccess:
      case PersonActionEnums.GetPersonError:
        /* NEW_ACTION_ENUM_GOES_HERE */
  
        return {
          ...state,
          ...payload,
        };
  
      default: {
        return state;
      }
    }
  }