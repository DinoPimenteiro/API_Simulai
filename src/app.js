import e from 'express';
import cookieParser from 'cookie-parser';
import userRouter from './routes/clientRoutes.js';
import authRouter from './routes/authRoutes.js';
import adminRouter from './routes/adminRoutes.js';

const app = e();

// Config
app.use(e.json());
app.use(e.urlencoded({extended: true}));
app.use(cookieParser());

// Rotas
app.use(userRouter)
app.use(authRouter)
app.use(adminRouter)


export default app;