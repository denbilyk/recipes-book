import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as RecipeActions from '../store/recipe.actions';
import {STORE_RECIPES} from './recipe.actions';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {Recipe} from '../recipe.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {

  storeRecipes = createEffect(() => {
    return this.actions$.pipe(ofType(STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipeState]) => {
        return this.http.put('https://ng-recipe-book-11e2e-default-rtdb.firebaseio.com/recipes.json', recipeState.recipes);
      })
    );
  }, {dispatch: false});

  fetchRecipe = createEffect(() => {
    return this.actions$.pipe(ofType(RecipeActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>('https://ng-recipe-book-11e2e-default-rtdb.firebaseio.com/recipes.json');
      }),
      map(resp => {
        return resp.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      map(recipes => new RecipeActions.SetRecipes(recipes))
    );
  });

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {
  }

}
