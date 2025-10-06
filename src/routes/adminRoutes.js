import adminController from '../Controllers/adminController.js';
import { Router } from "express";

const router = Router();

router.post("/admin/register", adminController.register);
router.get("/admin/comment", adminController.getAllComments);
router.get("/admin/comment/evaluation", adminController.getEvaluationComments);
router.get("/admin/comment/help", adminController.getHelpComments);

router.put("/admin/user/:userId/comment/:commentId/status", adminController.commentStatus);
router.delete("/admin/user/:userId/comment/:commentId", adminController.deleteComment);

export default router;