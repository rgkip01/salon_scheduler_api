import { Router } from "express";
import { SchedulesController } from "../controllers/SchedulersController";
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
class SchedulesRouter{
  private router: Router;
  private schedulesController: SchedulesController;
  private authMiddleware: AuthMiddleware;

  constructor(){
    this.router = Router();
    this.schedulesController = new SchedulesController;
    this.authMiddleware = new AuthMiddleware;
  }

  getRouter(){
    this.router.post(
      '/',
      this.authMiddleware.auth.bind(this.authMiddleware),
      this.schedulesController.store.bind(this.schedulesController)
    );

    this.router.get(
      '/',
      this.authMiddleware.auth.bind(this.authMiddleware),
      this.schedulesController.index.bind(this.schedulesController)
    );

    this.router.put(
      '/:id',
      this.authMiddleware.auth.bind(this.authMiddleware),
      this.schedulesController.update.bind(this.schedulesController)
    );
    return this.router;
  }
}

export { SchedulesRouter };