import { Router } from 'express';
import RecipeController from '../controllers/RecipeController.js';
import authenticationMiddleware from './../middlewares/authenticationMiddleware.js';
import recipeAuthorizationMiddleware from '../middlewares/recipeAuthorizationMiddleware.js';

const recipesRouter = Router();

recipesRouter.get('/', RecipeController.getAllRecipes);
recipesRouter.post(
  '/',
  authenticationMiddleware,
  RecipeController.createRecipe
);

recipesRouter.get('/:id', RecipeController.getRecipeById);
recipesRouter.patch(
  '/:id',
  authenticationMiddleware,
  recipeAuthorizationMiddleware,
  RecipeController.updateRecipe
);
recipesRouter.delete(
  '/:id',
  authenticationMiddleware,
  recipeAuthorizationMiddleware,
  RecipeController.deleteRecipe
);

export default recipesRouter;
