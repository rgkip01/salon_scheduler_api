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

  async update(name: string, newPassword: string, avatar_url: string) {
    return await prisma.users.update({
      where: {
        // ... provide filter here
      },
      data: {
        name,
        password: newPassword,
        avatar_url,
      }
    })
  }
}

export { UsersRepository };