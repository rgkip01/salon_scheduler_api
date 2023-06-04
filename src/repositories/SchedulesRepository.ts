import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "../database/prisma";
import { ICreate } from "../interfaces/SchedulesInterface";

class SchedulesRepository {
  async create({ name, phone, date, user_id }: ICreate) {
    return await prisma.schedule.create({
      data: {
        name,
        phone,
        date,
        user_id,
      }
    })
  }

  async findById(id: string) {
    return await prisma.schedule.findFirst({
      where: {
        id,
      }
    })
  }

  async findByDate(date: Date, user_id: string){
    return await prisma.schedule.findFirst({
      where: { date, user_id }
    })
  }

  async findAll(date: Date){
    return await prisma.schedule.findMany({
      where: {
        date: {
          gte: startOfDay(date),
          lt: endOfDay(date)
        } 
      },
      orderBy: {
        date: 'asc'
      }
    })
  }

  async update(id: string, date: Date) {
    return await prisma.schedule.update({
      where: {
        id,
      },
      data: {
        date,
      }
    });
  }

  async destroy(id: string) {
    return await prisma.schedule.delete({
      where: {
        id,
      }
    })
  }
}

export { SchedulesRepository };