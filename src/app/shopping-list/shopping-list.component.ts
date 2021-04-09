import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from './shopping-list.service';
import {Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import {StartEdit} from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  subscriptions: Subscription | undefined;

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    /* this.ingredients = this.shoppingListService.getIngredients();
     this.subscriptions = this.shoppingListService.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
       this.ingredients = ingredients;
     });
     this.loggingService.printLog('Hello from ShoppingListComponent');*/
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  onEditItem(idx: number): void {
    // this.shoppingListService.startedEditing.next(idx);
    this.store.dispatch(new StartEdit(idx));
  }
}
