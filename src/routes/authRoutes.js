import { Router } from "express";
import authController from "../Controllers/authController.js";
import authUser from "../Middlewares/authUser.js";

const router = Router();

router.post("/login", authController.login);
router.put("/refresh", authController.refresh);
router.delete("/logout", authUser, authController.logout);
router.post("/admin/invite", authUser, authController.recruitMail);
router.post("admin/register", authUser, authController.registerAdmin);

export default router;