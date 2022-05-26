import { UsernActionEnums } from "./actions";

export function UserReducer(incomingState, action) {
  const { type, payload } = action;
  //#endregion

  switch (type) {
    case UsernActionEnums.loginUserRequest:
    case UsernActionEnums.loginOutUserRequest:
    case UsernActionEnums.updateUserRequest:
      return {
        ...incomingState,
        ...payload,
      };

    default: {
      return incomingState;
    }
  }
}
