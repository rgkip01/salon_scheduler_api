import { Router } from "express";
import { SchedulesController } from "../controllers/SchedulersController";

class SchedulesRouter{
  private router: Router;
  private schedulesController: SchedulesController;

  constructor(){
    this.router = Router();
    this.schedulesController = new SchedulesController;
  }

  getRouter(){
    this.router.post(
      '/', 
      this.schedulesController.store.bind(this.schedulesController)
    );
    return this.router;
  }
}

export { SchedulesRouter };