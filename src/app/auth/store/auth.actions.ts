import {Action} from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const AUTHENTICATE_FAILED = '[Auth] Login Failed';
export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] Signup Start';
export const CLEAR_ERROR = '[Auth] Clear Error';


export class AuthenticateSuccess implements Action {
  readonly type: string = AUTHENTICATE_SUCCESS;

  constructor(public payload: {
    email: string,
    userId: string,
    token: string,
    expirationDate: Date,
    redirect: boolean,
  }) {
  }
}

export class LoginStart implements Action {
  readonly type: string = LOGIN_START;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class AuthenticateFailed implements Action {
  readonly type: string = AUTHENTICATE_FAILED;

  constructor(public payload: string) {
  }
}


export class Logout implements Action {
  readonly type: string = LOGOUT;

  constructor(public payload?: any) {
  }
}

export class SignupStart implements Action {
  readonly type: string = SIGNUP_START;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class ClearError implements Action {
  readonly type: string = CLEAR_ERROR;

  constructor(public payload?: never) {
  }
}

export class AutoLogin implements Action {
  readonly type: string = AUTO_LOGIN;

  constructor(public payload?: never) {
  }
}


export type AuthActions = AuthenticateSuccess | Logout | LoginStart | AuthenticateFailed | SignupStart | ClearError | AutoLogin;
