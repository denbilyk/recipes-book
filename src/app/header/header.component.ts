import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import {map} from 'rxjs/operators';
import {Logout} from '../auth/store/auth.actions';
import {FetchRecipes, StoreRecipes} from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  sub: Subscription;
  isAuthenticated = false;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.sub = this.store.select('auth').pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });
  }

  onSaveData(): void {
    this.store.dispatch(new StoreRecipes());
    // this.dataStorageService.saveRecipes();
  }

  onFetchRecipes(): void {
    this.store.dispatch(new FetchRecipes());
    // this.dataStorageService.fetchRecipes().subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onLogout(): void {
    this.store.dispatch(new Logout());
  }
}
