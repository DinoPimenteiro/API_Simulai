import e from 'express';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes.js';
import mailRouter from './routes/mailRoutes.js';
import authRouter from './routes/authRoutes.js';

const app = e();

// Config
app.use(e.json());
app.use(cookieParser());

// Rotas
app.use(userRouter)
app.use(mailRouter)
app.use(authRouter)


export default app;