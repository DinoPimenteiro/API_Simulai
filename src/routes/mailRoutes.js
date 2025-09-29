import { Router } from "express";
import authController from "../Controllers/authController.js";
import authUser from "../Middlewares/authUser.js";
import authAdmin from '../Middlewares/authAdmin.js'

const router = Router();

router.post("/recover-mail", authController.recoverMail);
router.post("/recover-mail/valid", authController.validCodeMail);
router.put("/reset-password", authUser, authController.resetPass);

router.post("/admin/invite", authAdmin, authController.recruitMail);

export default router;