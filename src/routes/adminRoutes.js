import { Router } from "express";
import authAdmin from "../Middlewares/authAdmin.js";
import adminController from "../Controllers/adminController.js";
import authController from "../Controllers/authController.js";

const router = Router();

router.post("/admin/register", adminController.register); // TESTADO
router.get("/admin/comment", adminController.getAllComments); //TESTADO
router.get("/comment/evaluation", adminController.getEvaluationComments); // TESTADO
router.get("/comment/help", adminController.getHelpComments); // TESTADO

router.put(
  "/admin/user/:userId/comment/:commentId/status",
  adminController.commentStatus
); //TESTADO
router.delete(
  "/admin/user/:userId/comment/:commentId",
  adminController.deleteComment
); // TESTADO

router.post("/admin/invite", authController.recruitMail); // TESTADO
router.get("/admins", adminController.getAllAdmin); // TESTADO
router.delete("/admin/:id", authAdmin, adminController.deleteAdmin); // TESTADO

export default router;
