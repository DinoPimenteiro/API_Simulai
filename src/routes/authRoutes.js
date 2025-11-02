import { Router } from "express";
import authController from "../Controllers/authController.js";
import authUser from "../Middlewares/authUser.js";

const router = Router();

router.post("/login", authController.login); //TESTADO
router.put("/refresh", authController.refresh); //TESTADO
router.delete("/logout", authUser, authController.logout); // TESTADO

// Admins
router.post("/admin/register/:id", authController.registerAdmin); // TESTADO
router.get("/admin/register/:id", authController.validateInvite); // TESTADO
router.post('/admin/login/:id', authController.loginAdmin); // TESTADO

// Client
router.post("/user/login/:id", authController.loginClient); // TESTADO

export default router;