import { Router } from "express";
import clientController from "../Controllers/clientController.js";
import authToken from "../Middlewares/auth.js";

const router = Router();


router.get("/users", clientController.getAll);
router.get("/user/:id", authToken, clientController.getOne);
router.post("/user", clientController.newClient);
router.delete("/user/:id", clientController.deleteUser);
router.put("/user/:id", authToken, clientController.updateUser);
router.post("/user/comment", authToken, clientController.comment);

export default router;