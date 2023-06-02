import { Router } from "express";

class SchedulesRouter{
  private router: Router;

  constructor(){
    this.router = Router();
  }

  getRouter(){
    this.router.post('/');
    return this.router;
  }
}

export { SchedulesRouter };