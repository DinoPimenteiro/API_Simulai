import e from 'express';
import routes from './routes.js';
import cookieParser from 'cookie-parser';

const app = e();

app.use(e.json());
app.use(cookieParser());
app.use(routes)

export default app;