import Recipe from './../models/Recipe.js';

const recipeAuthorizationMiddleware = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const recipe = await Recipe.getById(Number(id));

    if (!recipe) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Recipe not found' });
    }

    if (userId !== recipe.authorId) {
      return res.status(403).json({
        status: 'error',
        message: "You don't have permission to perform this action",
      });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Error validating permissions' });
  }
};

export default recipeAuthorizationMiddleware;
