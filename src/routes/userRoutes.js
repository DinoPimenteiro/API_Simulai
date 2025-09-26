import { Router } from "express";
import clientController from "../Controllers/clientController.js";
import authUser from "../Middlewares/authUser.js";

const router = Router();


router.get("/users", clientController.getAll);
router.get("/user/:id", authUser, clientController.getOne);
router.post("/user", clientController.newClient);
router.delete("/user/:id", clientController.deleteUser);
router.put("/user/:id", authUser, clientController.updateUser);
router.post("/user/comment", authUser, clientController.comment);

export default router;