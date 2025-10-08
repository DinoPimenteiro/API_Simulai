import { Router } from "express";
import authAdmin from '../Middlewares/authAdmin.js';
import adminController from '../Controllers/adminController.js';
import authController from "../Controllers/authController.js";

const router = Router();

router.post("/admin/register", adminController.register);
router.get("/admin/comment", authAdmin, adminController.getAllComments);
router.get("/admin/comment/evaluation", authAdmin, adminController.getEvaluationComments);
router.get("/admin/comment/help", authAdmin, adminController.getHelpComments);

router.put("/admin/user/:userId/comment/:commentId/status", authAdmin, adminController.commentStatus);
router.delete("/admin/user/:userId/comment/:commentId", authAdmin,adminController.deleteComment);

router.post("/admin/invite", authAdmin, authController.recruitMail);
router.get("/admins", authAdmin, adminController.getAllAdmin);
router.delete("/admin/:id", authAdmin, adminController.deleteAdmin);


export default router;