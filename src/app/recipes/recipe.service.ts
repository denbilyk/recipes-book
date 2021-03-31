import {Injectable} from '@angular/core';
import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';

@Injectable({providedIn: 'root'})
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe('Test Recipe', 'Test recipe description ', 'https://i1.wp.com/www.eatthis.com/wp-content/uploads/2019/10/pumpkin-pad-thai-recipe.jpg?resize=1400%2C788&ssl=1', [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]),
    new Recipe('Another Test Recipe', 'Test recipe description ', 'https://i1.wp.com/www.eatthis.com/wp-content/uploads/2019/10/pumpkin-pad-thai-recipe.jpg?resize=1400%2C788&ssl=1', [new Ingredient('Buns', 2), new Ingredient('Meat', 1)]),
  ];

  constructor(private slService: ShoppingListService) {
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(index: number): Recipe {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    this.slService.addIngredients(ingredients);
  }
}
