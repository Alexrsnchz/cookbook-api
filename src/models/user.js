import prisma from '../../prisma.js';

class User {
  static async getAll() {
    return prisma.user.findMany();
  }

  static async getById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async getByUsernameOrEmail(username = null, email = null) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [username ? { username } : null, email ? { email } : null].filter(
          Boolean
        ),
      },
    });

    return user;
  }

  static async create(data) {
    return prisma.user.create({
      data: data,
    });
  }

  static async update(id, data) {
    try {
      return await prisma.user.update({
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
      return await prisma.user.delete({
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

export default User;
