import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import * as AuthActions from './auth.actions';
import {User} from '../user.model';
import {AuthenticateSuccess} from "./auth.actions";
import {AuthService} from "../auth.service";


const handleAuth = (data) => {
  const expDate = new Date(new Date().getTime() + +data.expiresIn * 1000);
  const user = new User(data.email, data.localId, data.idToken, expDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: data.email,
    userId: data.localId,
    token: data.idToken,
    expirationDate: expDate,
    redirect: true
  });
};

const handleError = (errorRes) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFailed(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'The email already exists';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'The email does not exists';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Invalid password';
  }
  return of(new AuthActions.AuthenticateFailed(errorMessage));
};


@Injectable()
export class AuthEffects {
  private AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
  private SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';

  authSignup = createEffect(() => {
    return this.actions$.pipe(ofType(AuthActions.SIGNUP_START),
      switchMap((action: AuthActions.SignupStart, index: number) => {
        return this.http.post<AuthResponse>(this.SIGNUP_URL + environment.firebaseAPIKey,
          {
            email: action.payload.email,
            password: action.payload.password,
            returnSecureToken: true
          }).pipe(
          tap((respData) => this.authService.setLogoutTimer(+respData.expiresIn * 1000)),
          map(respData => handleAuth(respData)), catchError(errorRes => handleError(errorRes)));
      }),
    );
  });

  authLogin = createEffect(() => {
    return this.actions$.pipe(ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart, index: number) => {
        return this.http.post<AuthResponse>(this.AUTH_URL + environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap((respData) => this.authService.setLogoutTimer(+respData.expiresIn * 1000)),
          map(respData => handleAuth(respData)), catchError(errorRes => handleError(errorRes)));
      }),
    );
  });

  authRedirect = createEffect(() => {
    return this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), tap((action: AuthenticateSuccess) => {
        if (action.payload.redirect) {
          this.router.navigate(['/']);
        }
      }
    ))
      ;
  }, {dispatch: false});


  authLogout = createEffect(() => {
    return this.actions$.pipe(ofType(AuthActions.LOGOUT),
      tap(() => {
        this.authService.clearExpirationTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      }),
    );
  }, {dispatch: false});

  autoLogin = createEffect(() => {
    return this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string,
          id: string,
          _token: string,
          _tokenExparationData: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return {type: 'DUMMY'};
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExparationData));
        if (loadedUser.token) {
          const expDuration = new Date(userData._tokenExparationData).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expDuration);
          return new AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExparationData),
            redirect: false
          });
        }
        return {type: 'DUMMY'};
      }),
    );
  });

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {
  }

}

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
