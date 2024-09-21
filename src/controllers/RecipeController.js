import Recipe from '../models/Recipe';

class RecipeController {
  static async getAllRecipes(req, res) {
    try {
      const recipes = await Recipe.getAll();

      return res.status(200).json(recipes);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error fetching recipes' });
    }
  }

  static async getAllRecipesByAuthor(req, res) {
    const { authorId } = req.params;
    try {
      const recipes = await Recipe.getAllByAuthor(Number(authorId));

      if (!recipes) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Author not found' });
      }

      return res.status(200).json(recipes);
    } catch (error) {
      console.error(error);
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
      console.error(error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error fetching recipe' });
    }
  }

  static async createRecipe(req, res) {
    const data = req.body;

    try {
      const recipe = await Recipe.create(data);

      return res.status(201).json(recipe);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error creating recipe' });
    }
  }

  static async updateRecipe(req, res) {
    const { id } = req.params;
    const data = req.body;

    try {
      const recipe = await Recipe.update(Number(id), data);

      if (!recipe) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Recipe not found' });
      }

      return;
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error updating recipe' });
    }
  }

  static async deleteRecipe(req, res) {
    const { id } = req.params;

    try {
      const recipe = await Recipe.delete(Number(id));

      if (!recipe) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Recipe not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error deleting recipe' });
    }
  }
}

export default RecipeController;
