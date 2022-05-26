import React, { FC, useReducer, useContext, useEffect, PropsWithChildren } from 'react';
import { authReducer } from './reducer';
import { AuthStateContext, AuthActionsContext } from './contexts';
import {
  checkAuthAction,
  loginUserAction,
  loginUserSuccessAction,
  loginUserErrorAction,
  logoutUserAction,
  logoutUserSuccessAction,
  logoutUserErrorAction,
  resetPasswordAction,
  resetPasswordSuccessAction,
  resetPasswordErrorAction,
  toggleVerifyOtpModalVisibilityAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
  // fetchUserInfoAction,
} from './actions';
import { ILoginForm, IHttpResponse, IAccessToken } from 'models';
import { getAccessToken, removeAccessToken, saveUserToken } from 'utils/auth';
import { useRouter } from 'next/router';
import { LOGIN_PAGE_URL, DASHBOARD_PAGE_URL, CHANGE_PASSWORD_PAGE_URL } from 'routes';
import { useUserResetPasswordUsingToken, ResetPasswordUsingTokenInput, AjaxResponseBase } from 'api/user';
import { useRouteState } from 'providers/route';
import { getFlagSetters } from 'providers/utils/flagsSetters';
import { useTokenAuthAuthenticate, useTokenAuthSignOff } from 'api/tokenAuth';
import { useSessionGetCurrentLoginInformations } from 'api/session';
import IdleTimer from 'react-idle-timer';

const AuthProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {});

  const router = useRouter();

  const { nextRoute } = useRouteState();

  //#region `checkAuth`
  const checkAuth = () => {
    dispatch(checkAuthAction());

    const tokenResult = getAccessToken();

    if (tokenResult && !state.loginInfo && !state?.error?.fetchUserData) {
      fetchUserInfoRequest();
    } else {
      if (nextRoute) {
        router.push(`${LOGIN_PAGE_URL}?returnUrl=${nextRoute}`);
      } else {
        router.push(LOGIN_PAGE_URL);
      }
    }
  };
  //#endregion

  //#region Fetch user login info
  const {
    loading: fetchingUserInfo,
    refetch: fetchUserInfoRequest,
    error: fetchUserInfoErrorResult,
    data: userInfoData,
  } = useSessionGetCurrentLoginInformations({
    lazy: true,
  });

  useEffect(() => {
    if (!fetchingUserInfo) {
      if (userInfoData) {
        dispatch(loginUserSuccessAction(userInfoData.result.user));

        if (state.requireChangePassword) {
          router.push(CHANGE_PASSWORD_PAGE_URL);
        } else {
          if (router.route === LOGIN_PAGE_URL) {
            const returnUrl = router.query?.returnUrl as string;
            router.push(returnUrl ?? DASHBOARD_PAGE_URL);
          }
        }
      }

      if (fetchUserInfoErrorResult) {
        dispatch(loginUserErrorAction('Oops, something went wrong', true));
      }
    }
  }, [fetchingUserInfo && state.hasCheckedReauth]);
  //#endregion

  //#region  Login
  const { mutate: loginUserRequest } = useTokenAuthAuthenticate({});

  useEffect(() => {
    if (state.loginUserSuccessful) {
      if (nextRoute) {
        router.push(nextRoute);
      } else {
        router.push(DASHBOARD_PAGE_URL);
      }
    }
  }, [state.loginUserSuccessful]);

  const loginUser = (loginFormData: ILoginForm) => {
    const SIGN_IN_ERROR_MESSAGE = 'Please make sure that your username and password are correct';
    dispatch(loginUserAction(loginFormData));

    loginUserRequest(loginFormData)
      .then(data => {
        if (data) {
          const tokenResult = saveUserToken(data.result as IAccessToken);

          // Token saved successfully
          if (tokenResult) {
            // Let's fetch the user info
            fetchUserInfoRequest();
          }

          if (data.error) {
            dispatch(loginUserErrorAction(data.error.details || data.error.message || '', false));
          }
        }
      })
      .catch((err: IHttpResponse<IAccessToken>) => {
        try {
          const {
            data: {
              error: { message, details },
            },
          } = err;

          dispatch(
            loginUserErrorAction(
              `${message?.toLowerCase().includes('internal') ? SIGN_IN_ERROR_MESSAGE : message} ${details || ''}`,
              false
            )
          );
        } catch (error) {
          dispatch(loginUserErrorAction('Sorry, an error occured while trying to sign you in', false));
        }
      });
  };
  ////#endregion

  //#region Logout user
  const { mutate: signOffRequest } = useTokenAuthSignOff({});

  const logoutUser = () => {
    const LOGOUT_ERROR_MSG = 'Logout Error';
    dispatch(logoutUserAction());

    const result = removeAccessToken();

    const signOffError = () => dispatch(logoutUserErrorAction(LOGOUT_ERROR_MSG));

    signOffRequest(null)
      .then(() => {
        if (result) {
          dispatch(logoutUserSuccessAction());
          router.push(LOGIN_PAGE_URL);
        } else {
          signOffError();
          dispatch(logoutUserSuccessAction());
        }
      })
      .catch(() => {
        signOffError();
        dispatch(logoutUserSuccessAction());
        router.push(LOGIN_PAGE_URL);
      });
  };
  //#endregion

  //#region Reset password

  const { mutate: resetPasswordHttp } = useUserResetPasswordUsingToken({});

  const resetPassword = (payload: ResetPasswordUsingTokenInput) => {
    dispatch(resetPasswordAction(payload));
    resetPasswordHttp(payload)
      .then(data => {
        const res = data as AjaxResponseBase;
        if (res?.success) {
          dispatch(resetPasswordSuccessAction(res));

          setTimeout(() => {
            router.push(LOGIN_PAGE_URL);
          }, 5000);
        } else {
          dispatch(resetPasswordErrorAction('Sorry, there was an error resetting your password'));
        }
      })
      .catch(() => {
        dispatch(resetPasswordErrorAction('Sorry, there was an error resetting your password'));
      });
  };
  //#endregion

  const toggleVerifyOtpModalVisibility = (value: boolean) => dispatch(toggleVerifyOtpModalVisibilityAction(value));

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  return (
    <IdleTimer>
      <AuthStateContext.Provider value={state}>
        <AuthActionsContext.Provider
          value={{
            ...getFlagSetters(dispatch),
            checkAuth,
            loginUser,
            logoutUser,
            resetPassword,
            toggleVerifyOtpModalVisibility,
            /* NEW_ACTION_GOES_HERE */
          }}
        >
          {children}
        </AuthActionsContext.Provider>
      </AuthStateContext.Provider>
    </IdleTimer>
  );
};

function useAuthState() {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
}

function useAuthActions() {
  const context = useContext(AuthActionsContext);
  if (context === undefined) {
    throw new Error('useAuthActions must be used within a AuthProvider');
  }
  return context;
}

function useAuth() {
  return { ...useAuthActions(), ...useAuthState() };
}

export { AuthProvider, useAuthState, useAuthActions, useAuth };
