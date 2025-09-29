import adminController from '../Controllers/adminController.js';
import { Router } from "express";

const router = Router();

router.post("/admin/register", adminController.register);

export default router;