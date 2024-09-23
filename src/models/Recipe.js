import prisma from '../../prisma.js';

class Recipe {
  static async getAll() {
    return await prisma.recipe.findMany();
  }

  static async getById(id) {
    return await prisma.recipe.findUnique({
      where: { id },
    });
  }

  static async create(data) {
    const { authorId, ...recipeData } = data;

    return await prisma.recipe.create({
      data: {
        ...recipeData,
        author: { connect: { id: authorId } },
      },
    });
  }

  static async update(id, data) {
    try {
      return await prisma.recipe.update({
        where: { id },
        data: data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }

  static async delete(id) {
    try {
      return await prisma.recipe.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }
}

export default Recipe;
