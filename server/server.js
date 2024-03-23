const app = express();
import dotenv from 'dotenv';
import 'express-async-errors';
import express from 'express';
import path from 'path';
dotenv.config();
import connectDB from './db/connect.js';
import cookieParser from 'cookie-parser';

// routers
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import uploadRouter from './routes/uploadRouter.js';

// middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

connectDB();

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/upload', uploadRouter);

const __dirname = path.resolve();
console.log(__dirname);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// page not found(404) middleware
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'page not found' });
});

// error middleware
app.use(errorHandlerMiddleware);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}...`));
