import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "../database/prisma";
import { ICreate } from "../interfaces/SchedulesInterface";

class SchedulesRepository {
  async create({name, phone, date}: ICreate) {
    return await prisma.schedule.create({
      data: {
        name,
        phone,
        date
      }
    })
  }

  async findByDate(date: Date){
    return await prisma.schedule.findFirst({
      where: { date }
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
}

export { SchedulesRepository };