import { Router } from "express";
import authController from "../Controllers/authController.js";
import authUser from "../Middlewares/authUser.js";

const router = Router();

router.post("/recover-mail", authController.recoverMail);
router.post("/recover-mail/valid", authController.validCodeMail);
router.put("/reset-password", authUser, authController.resetPass);

export default router;