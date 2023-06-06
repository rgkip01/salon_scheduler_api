import { NextFunction, Request, Response } from "express";
import { SchedulersServices } from "../services/SchedulesServices";
import { parseISO } from "date-fns";

class SchedulesController {
  private schedulesServices: SchedulersServices;

  constructor(){
    this.schedulesServices = new SchedulersServices;
  }
  async index(request: Request, response: Response, next: NextFunction){
    const { date } = request.query;
    const parseDate = date ? parseISO(date.toString()) : new Date();
    console.log(parseDate);
    

    try { 
      const results = await this.schedulesServices.searchAllByDate(parseDate);
      return response.status(200).json(results);
    } catch (error) {
      next(error)
    }
  }

  async store(request: Request, response: Response, next: NextFunction){
    const { name, phone, date } = request.body;
    const { user_id } =  request;
    try {
      const result = await this.schedulesServices.create({name, phone, date, user_id });
      
      return response.status(201).json(result)
    } catch (error) {
      next(error)
    } 
  }

  async update(request: Request, response: Response, next: NextFunction){
    try {
      const { id } = request.params;
      const { date } = request.body;
      const { user_id } = request;

      const result = await this.schedulesServices.update(id, date, user_id)
      return response.status(200).json({
        message: 'Schedule updated successfully',
      })    
    } catch (error) {
      next(error)
    }
  }

  async destroy(request: Request, response: Response, next: NextFunction){
    try {
      const { id } = request.params
      const scheduleFound = await this.schedulesServices.findById(id);
      
      if (scheduleFound) {
        await this.schedulesServices.destroy(scheduleFound.id)
        return response.status(200).json({
          message: 'Schedule deleted with successfully',
        })
      }
    } catch (error) {
      next(error)
    }
  }
}

export { SchedulesController };