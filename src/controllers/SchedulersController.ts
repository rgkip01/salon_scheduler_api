import { NextFunction, Request, Response } from "express";
import { SchedulersServices } from "../services/SchedulesServices";

class SchedulesController {
  private schedulesServices: SchedulersServices;

  constructor(){
    this.schedulesServices = new SchedulersServices;
  }
  async store(request: Request, response: Response, next: NextFunction){
    const { name, phone, date } = request.body;
    try {
      const result = await this.schedulesServices.create({name, phone, date });
      return response.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
}

export { SchedulesController };