import { Router } from "express";
import authUser from "../Middlewares/authUser.js";
import { uploadUserFiles } from "../Middlewares/uploadUser.js";
import clientController from "../Controllers/clientController.js";
import authController from "../Controllers/authController.js";

const router = Router();

router.post("/user", uploadUserFiles, clientController.newClient); //TESTADO
router.get("/user/:id", authUser, clientController.getOne); //TESTADO
router.put("/user/:id", uploadUserFiles, authUser, clientController.updateUser); // TESTADO
router.post("/user/comment/:id", authUser, clientController.comment); // TESTADO
router.delete("/user/:userId/comment/:commentId", authUser, clientController.deleteComment); // TESTADO

router.post("/recover-mail", authController.recoverMail); // TESTADO
router.post("/recover-mail/valid", authController.validCodeMail); //TESTADO
router.put("/reset-password/:id", authUser, authController.resetPass); //TESTADO
router.post("/contact", clientController.contactMail); // TESTADO

router.get("/metrics", clientController.clientsMetrics); //TESTADO
router.get("/users", clientController.getAll); // TESTADO
router.delete("/user/:id", authUser, clientController.deleteUser); //TESTADO

export default router;
