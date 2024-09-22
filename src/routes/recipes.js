import { Router } from 'express';
import RecipeController from '../controllers/RecipeController';

const recipesRouter = Router();

recipesRouter.get('/', RecipeController.getAllRecipes);
recipesRouter.post('/', RecipeController.createRecipe);

recipesRouter.get('/:id', RecipeController.getRecipeById);
recipesRouter.patch('/:id', RecipeController.updateRecipe);
recipesRouter.delete('/:id', RecipeController.deleteRecipe);

export default recipesRouter;
