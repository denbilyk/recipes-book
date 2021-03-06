import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import {AutoLogin} from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(new AutoLogin());
  }

}
