import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import {Logout} from './store/auth.actions';


@Injectable({providedIn: 'root'})
export class AuthService {

  tokenExpTimer: any;

  constructor(private store: Store<fromApp.AppState>) {
  }

  setLogoutTimer(expDuration: number): void {
    this.tokenExpTimer = setTimeout(() => {
      this.store.dispatch(new Logout());
    }, expDuration);
  }

  clearExpirationTimer(): void {
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
      this.tokenExpTimer = null;
    }
  }
}
