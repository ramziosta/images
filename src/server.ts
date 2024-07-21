import express, { Application } from 'express';
import imageRoutes from './routes/imageRoutes';
import { errorHandler } from './utils/errorHandler';
import path from 'path';

const port: string | number = process.env.PORT || 3000;
const app: Application = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../../images')));

app.use('/', imageRoutes);
app.use(errorHandler);

app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
});