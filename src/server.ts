import express, { Application } from 'express';
import imageRoutes from './routes/imageRoutes';
import { errorHandler } from './utils/errorHandler';

const app: Application = express();
const port: string | number = process.env.PORT || 3000;

app.use(express.json());
app.use('/', imageRoutes);
app.use(errorHandler);

app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
});