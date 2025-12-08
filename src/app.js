import e from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/clientRoutes.js";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import interviewRouter from "./routes/interviewRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = e();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use((req, res, next) => {
//   if (req.path === "/transcrever-texto") {
//     return e.raw({ type: "*/*" })(req, res, next);
//   }
//   next();
// });

// Config
app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", e.static(path.join(__dirname, "..", "uploads")));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174", // Web
      "*", // Mobile (React Native sem origem)
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-client-agent"],
  })
);

// Rotas
app.use(userRouter);
app.use(authRouter);
app.use(adminRouter);
app.use(interviewRouter);

export default app;
