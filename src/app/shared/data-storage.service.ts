import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {map, tap} from 'rxjs/operators';
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService) {

  }

  saveRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://ng-recipe-book-11e2e-default-rtdb.firebaseio.com/recipes.json', recipes)
      .subscribe(resp => {
        console.log(resp);
      });

  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>('https://ng-recipe-book-11e2e-default-rtdb.firebaseio.com/recipes.json')
      .pipe(map(resp => {
        return resp.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }), tap(recipes => this.recipeService.setRecipes(recipes)));
  }
}
