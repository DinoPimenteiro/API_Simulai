import jwt from "jsonwebtoken";
import { sendError, errors } from "../utils/sendError.js";

export default async function authUser(req, res, next) {
  const authToken = req.headers["authorization"];

  if (authToken !== undefined) {
    const header = authToken.split(" ");

    const token = header[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if (payload.role === "Manager" || payload.role === "Boss") {
        req.admin = payload;
        next();
      } else {
        sendError(res, "not allowed", 403, errors.unauthorized)
      }
    } catch (err) {
      sendError(res, err.message, 401, errors.auth)
    }
  } else {
    sendError(res, "undefined token", 400, errors.auth)
  }
}
