import { Router } from "express";
import authController from "../Controllers/authController.js";
import authToken from "./Middlewares/auth.js";

const router = Router();

router.post("/recover-mail", authController.recoverMail);
router.post("/recover-mail/valid", authController.validCodeMail);
router.put("/reset-password", authToken, authController.resetPass);

export default router;