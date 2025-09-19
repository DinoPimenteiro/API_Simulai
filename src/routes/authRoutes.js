import { Router } from "express";
import authController from "../Controllers/authController.js";
import authToken from "./Middlewares/auth.js";

const router = Router();

router.post("/login", authController.login);
router.put("/refresh", authController.refresh);
router.delete("/logout", authToken, authController.logout);

export default router;