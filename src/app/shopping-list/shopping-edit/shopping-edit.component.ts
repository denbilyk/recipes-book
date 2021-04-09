import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {AddIngredient, DeleteIngredient, StopEdit, UpdateIngredient} from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') form: NgForm | undefined;
  subscription: Subscription | undefined;
  editMode = false;
  editedItemIndex = -1;
  editedItem: Ingredient | undefined;

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(state => {
      if (state.editedIndex > -1) {
        this.editMode = true;
        this.editedItem = state.editedIngredient;
        this.editedItemIndex = state.editedIndex;
        this.form?.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
    /*this.subscription = this.shoppingListService.startedEditing.subscribe((idx: number) => {
      this.editedItemIndex = idx;
      this.editMode = true;
      this.editedItem = this.shoppingListService.getIngredient(this.editedItemIndex);
      this.form?.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      });
    });*/
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(new UpdateIngredient(newIngredient));
    } else {
      // this.shoppingListService.addIngredient(new Ingredient(value.name, value.amount));
      this.store.dispatch(new AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.store.dispatch(new StopEdit());
  }

  onClearForm(): void {
    this.editMode = false;
    this.form?.reset();
    this.store.dispatch(new StopEdit());
  }

  onDelete(): void {
    // this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new DeleteIngredient());
    this.onClearForm();
  }
}
