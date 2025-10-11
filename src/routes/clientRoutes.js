import { Router } from "express";
import authUser from "../Middlewares/authUser.js";
import clientController from "../Controllers/clientController.js";
import authController from "../Controllers/authController.js";

const router = Router();


router.get("/users", clientController.getAll);
router.get("/user/:id", authUser, clientController.getOne);
router.post("/user", clientController.newClient);
router.delete("/user/:id", authUser, clientController.deleteUser);
router.put("/user/:id", authUser, clientController.updateUser);
router.post("/user/comment/:id", authUser, clientController.comment);

router.delete("/user/:userId/comment/:commentId", authUser, clientController.deleteComment);

router.post("/recover-mail", authController.recoverMail);
router.post("/recover-mail/valid", authController.validCodeMail);
router.put("/reset-password", authUser, authController.resetPass);

export default router;   