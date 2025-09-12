import { Router } from "express";
import clientController from "./Controllers/clientController.js";
import authController from "./Controllers/authController.js";
import authToken from "./Middlewares/auth.js";

const routes = Router();

routes.get("/users", clientController.getAll);
routes.get("/user/:id", authToken, clientController.getOne);
routes.post("/user", clientController.newClient);
routes.delete("/user/:id", clientController.deleteUser);
routes.put("/user/:id", authToken, clientController.updateUser);
routes.post("/user/comment", authToken, clientController.comment);

routes.post("/login", authController.login);
routes.put("/refresh", authController.refresh);
routes.delete("/logout", authToken, authController.logout);

routes.post("/recover-mail", authController.recoverMail);
routes.post("/recover-mail/valid", authController.validCodeMail);
routes.put("/reset-password", authToken, authController.resetPass);

export default routes;
