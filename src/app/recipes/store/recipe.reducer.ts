import {Recipe} from '../recipe.model';
import * as RecipeActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState = {
  recipes: []
};

export function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      };

    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case RecipeActions.UPDATE_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes.filter((recipe: Recipe, index: number) => action.payload.index !== index), action.payload.newRecipe]
      };
    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes.filter((recipe, index) => action.payload !== index)]
      };
    default:
      return state;
  }
}
