import { Router } from "express";
import authController from "../Controllers/authController.js";
// import authUser from "../Middlewares/authUser.js";
// import authAdmin from '../Middlewares/authAdmin.js'

const router = Router();

router.post("/login", authController.login);
router.put("/refresh", authController.refresh);
router.delete("/logout", authController.logout);
router.post("/admin/register/:id", authController.registerAdmin);
router.get("/admin/register/:id", authController.validateInvite);
router.post('/admin/login/:id', authController.loginAdmin);

export default router; 