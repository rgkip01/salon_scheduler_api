import { ICreate } from "../interfaces/SchedulesInterface";
import { SchedulesRepository } from "../repositories/SchedulesRepository";

class SchedulersServices {
  private schedulesRepository: SchedulesRepository

  constructor(){
    this.schedulesRepository = new SchedulesRepository;
  }

  create({ name, phone, date }: ICreate){
    console.log("FUI INTERCEPTADO=>", name, phone, date)
  }
}

export { SchedulersServices };