import { Router } from "express";
import authUser from "../Middlewares/authUser.js";
import { uploadUserFiles } from "../Middlewares/uploadUser.js";
import clientController from "../Controllers/clientController.js";
import authController from "../Controllers/authController.js";

const router = Router();

router.post("/user", uploadUserFiles, clientController.newClient);
router.get("/user/:id", authUser, clientController.getOne);
router.put("/user/:id", uploadUserFiles, authUser, clientController.updateUser);
router.post("/user/comment/:id", authUser, clientController.comment);
router.delete("/user/:userId/comment/:commentId", authUser, clientController.deleteComment);

router.post("/recover-mail", authController.recoverMail);
router.post("/recover-mail/valid", authController.validCodeMail);
router.put("/reset-password", authUser, authController.resetPass);
router.post("/contact", clientController.contactMail);

router.get("/metrics", clientController.clientsMetrics);
router.get("/users", clientController.getAll);
router.delete("/user/:id", authUser, clientController.deleteUser);

export default router;
