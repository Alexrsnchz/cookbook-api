import Recipe from '../models/Recipe.js';
import { z } from 'zod';
import {
  baseRecipeSchema,
  recipeUpdateSchema,
} from './../validations/RecipeSchema.js';

class RecipeController {
  static async getAllRecipes(req, res) {
    try {
      const recipes = await Recipe.getAll();

      return res.status(200).json(recipes);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Error fetching recipes' });
    }
  }

  static async getRecipeById(req, res) {
    const { id } = req.params;

    try {
      const recipe = await Recipe.getById(Number(id));

      if (!recipe) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Recipe not found' });
      }

      return res.status(200).json(recipe);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Error fetching recipe' });
    }
  }

  static async createRecipe(req, res) {
    const data = req.body;

    try {
      const validatedData = baseRecipeSchema.parse(data);
      const recipe = await Recipe.create({
        ...validatedData,
        authorId: req.user.id,
      });

      return res.status(201).json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          message: err.message,
          path: err.path,
        }));

        return res
          .status(400)
          .json({ status: 'error', message: formattedErrors });
      }

      return res
        .status(500)
        .json({ status: 'error', message: 'Error creating recipe' });
    }
  }

  static async updateRecipe(req, res) {
    const { id } = req.params;
    const data = req.body;

    try {
      const validatedData = recipeUpdateSchema.parse(data);
      const updatedRecipe = await Recipe.update(Number(id), validatedData);

      return res.status(200).json(updatedRecipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          message: err.message,
          path: err.path,
        }));

        return res
          .status(400)
          .json({ status: 'error', message: formattedErrors });
      }

      return res
        .status(500)
        .json({ status: 'error', message: 'Error updating recipe' });
    }
  }

  static async deleteRecipe(req, res) {
    const { id } = req.params;

    try {
      await Recipe.delete(Number(id));

      return res.status(204).send();
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Error deleting recipe' });
    }
  }
}

export default RecipeController;
