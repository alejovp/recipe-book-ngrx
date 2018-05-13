import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable()
export class DataStorageService {
  private dbUrl: string = 'https://ng-recipe-book-4a06b.firebaseio.com/';

  constructor(
    private httpClient: HttpClient,
    private recipeService: RecipeService,
  ) { }

  storeRecipes() {
    const req = new HttpRequest(
      'PUT',
      `${this.dbUrl}recipes.json`,
      this.recipeService.getRecipes(),
      { reportProgress: true } // This option give me info about the progress
    );

    return this.httpClient.request(req);
  }

  getStoredRecipes() {
    
    return this.httpClient.get<Recipe[]>(`${this.dbUrl}recipes.json`)
      .map(
        // By default HttpCLient get only the body in response and use type JSON (all these can be changed)
        (recipes) => {
          for (let recipe of recipes) {
            if (!recipe['ingredients']) {
              recipe.ingredients = []
            }
          }
          return recipes;
        }
      )
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        }
      );
  }
}