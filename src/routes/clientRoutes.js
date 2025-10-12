import { Router } from "express";
import authUser from "../Middlewares/authUser.js";
import { uploadUserFiles } from "../Middlewares/uploadUser.js";
import clientController from "../Controllers/clientController.js";
import authController from "../Controllers/authController.js";

const router = Router();

router.get("/user/:id", authUser, clientController.getOne);
router.post("/user", uploadUserFiles, clientController.newClient);
router.delete("/user/:id", authUser, clientController.deleteUser);
router.put("/user/:id", authUser, clientController.updateUser);
router.post("/user/comment/:id", authUser, clientController.comment);
router.delete(
  "/user/:userId/comment/:commentId",
  authUser,
  clientController.deleteComment
);

router.post("/recover-mail", authController.recoverMail);
router.post("/recover-mail/valid", authController.validCodeMail);
router.put("/reset-password", authUser, authController.resetPass);
router.post("/contact", clientController.contactMail);

router.get("/metrics", clientController.clientsMetrics);
router.get("/users", clientController.getAll);

export default router;
