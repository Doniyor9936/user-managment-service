import 'reflect-metadata';
import express, { Router } from 'express';
import { AppDataSource } from './config/data-source';
import router from './modules/user/routers/user.router';

const app = express();
app.use(express.json());
app.use(router)

const PORT = process.env.PORT || 4444;

AppDataSource.initialize()
  .then(() => {
    console.log('database connected');
    app.listen(PORT, () => {
      console.log(`server runnning on the ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('database connect error', err);
  });
