import express, { Application, NextFunction, Request, Response } from "express";
import { UsersRoutes } from "./routes/users.routes";
import { SchedulesRouter } from "./routes/schedules.routes";

const app:Application = express()

app.use(express.json())
app.use(express.urlencoded({extended: true }));

const usersRoutes = new UsersRoutes().getRoutes();
const schedulesRoutes = new SchedulesRouter().getRouter();

app.use('/users', usersRoutes)
app.use('/schedules', schedulesRoutes)

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
      return response.status(400).json({
        message: err.message,
      });
    }
    return response.status(500).json({
      message: 'Internal Server Error',
    });
  },
);


app.listen(3000, () => console.log('Server is running in port 3000'));