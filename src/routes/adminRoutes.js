import { Router } from "express";
import authAdmin from '../Middlewares/authAdmin.js';
import adminController from '../Controllers/adminController.js';
import authController from "../Controllers/authController.js";

const router = Router();

router.post("/admin/register", adminController.register); // TESTADO
router.get("/admin/comment", authAdmin, adminController.getAllComments); //TESTADO
router.get("/admin/comment/evaluation", authAdmin, adminController.getEvaluationComments); // TESTADO
router.get("/admin/comment/help", authAdmin, adminController.getHelpComments); // TESTADO

router.put("/admin/user/:userId/comment/:commentId/status", authAdmin, adminController.commentStatus); //TESTADO
router.delete("/admin/user/:userId/comment/:commentId", authAdmin,adminController.deleteComment); // TESTADO

router.post("/admin/invite", authAdmin, authController.recruitMail); // TESTADO
router.get("/admins", authAdmin, adminController.getAllAdmin); // TESTADO
router.delete("/admin/:id", authAdmin, adminController.deleteAdmin); // TESTADO
 
export default router;