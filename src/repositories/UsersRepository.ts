import { prisma } from "../database/prisma";
import { ICreate } from "../interfaces/UsersInterface";

class UsersRepository {
  async create({ name, email, password }: ICreate) {
    return await prisma.users.create({
      data: {
        name,
        email,
        password,
      }
    });
  }

  async findUserByEmail(email: string) {
    return await prisma.users.findUnique({
      where: {
        email,
      }
    })
  }

  async findUserById(id: string) {
    return await prisma.users.findUnique({
      where: {
        id,
      }
    })
  }

  async update(
    name: string,
    avatar_url: string,
    user_id: string
  ) {
    return await prisma.users.update({
      where: {
        id: user_id
      },
      data: {
        name,
        avatar_url,
      }
    })
  }

  async updateWithNewPassword(
    newPassword: string,
    user_id: string
  ) {
    return await prisma.users.update({
      where: {
        id: user_id
      },
      data: {
        password: newPassword,
      }
    })
  }
}

export { UsersRepository };