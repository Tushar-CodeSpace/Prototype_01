// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import messageRoute from './routes/message.route.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute);
app.use('/api/message', messageRoute);

export default app;