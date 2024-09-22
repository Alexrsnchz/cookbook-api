import prisma from '../../prisma.js';

class Recipe {
  static async getAll() {
    return prisma.recipe.findMany();
  }

  static async getById(id) {
    return prisma.recipe.findUnique({
      where: { id },
    });
  }

  static async create(data) {
    return prisma.recipe.create({
      data: data,
    });
  }

  static async update(id, data) {
    try {
      return prisma.recipe.update({
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
      return prisma.recipe.delete({
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
