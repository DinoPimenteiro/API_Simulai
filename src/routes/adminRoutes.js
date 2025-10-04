import adminController from '../Controllers/adminController.js';
import { Router } from "express";

const router = Router();

router.post("/admin/register", adminController.register);
router.get("/admin/commentsHelp", adminController.getCommentsHelp);
router.get("/admin/commentsEvaluation", adminController.getCommentsEvaluation);
// Testar
router.delete("/admin/user/:userId/comment/:commentId", adminController.deleteComment);

export default router;