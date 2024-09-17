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

  static async getByUsername(username) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  static async getByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async create(data) {
    return prisma.user.create({
      data: data,
    });
  }

  static async update(id, data) {
    return prisma.user.update({
      where: { id },
      data: data,
    });
  }

  static async delete(id) {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export default User;
