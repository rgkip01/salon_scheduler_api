import { SchedulesRepository } from "../repositories/SchedulesRepository";

class SchedulersServices {
  private schedulesRepository: SchedulesRepository

  constructor(){
    this.schedulesRepository = new SchedulesRepository;
  }
}