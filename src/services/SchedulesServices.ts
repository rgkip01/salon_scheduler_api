import { ICreate } from "../interfaces/SchedulesInterface";
import { SchedulesRepository } from "../repositories/SchedulesRepository";
import { isBefore, startOfHour } from 'date-fns';
class SchedulersServices {
  private schedulesRepository: SchedulesRepository

  constructor(){
    this.schedulesRepository = new SchedulesRepository;
  }

  async create({ name, phone, date }: ICreate){
    const formatDate = new Date(date)
    const hourStarted = startOfHour(formatDate)

    if (isBefore(hourStarted, new Date())) {
      throw new Error("It is not allowed to schedule old date");
    }

    const checkIsAvailable = await this.schedulesRepository.findByDate(hourStarted);

    if(checkIsAvailable) {
      throw new Error("Schedule date is not available"); 
    }

    return await this.schedulesRepository.create({name, phone, date: hourStarted })
  }

  async searchAllByDate(date: Date) {
    return await this.schedulesRepository.findAll(date)
  }

  async update(id: string, date: Date){
    const formatDate = new Date(date)
    const hourStarted = startOfHour(formatDate)

    if (isBefore(hourStarted, new Date())) {
      throw new Error("It is not allowed to schedule old date");
    }

    const checkIsAvailable = await this.schedulesRepository.findByDate(hourStarted);

    if(checkIsAvailable) {
      throw new Error("Schedule date is not available"); 
    }

    return await this.schedulesRepository.update(id, hourStarted)
  }
}

export { SchedulersServices }; 