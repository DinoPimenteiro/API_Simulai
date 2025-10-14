import jwt from "jsonwebtoken";
import { sendError, errors } from "../utils/sendError.js";
import fs from 'fs'

export default async function authUser(req, res, next) {
  const authToken = req.headers["authorization"];

  if (authToken !== undefined) {
    const header = authToken.split(" ");

    const token = header[1];
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      req.user = data;
      next();
    } catch (err) {

      if (req.savedFiles) {
        const { profilePath, resumePath } = req.savedFiles;
        if (fs.existsSync(profilePath)) {
          await fs.promises.unlink(profilePath);
        }

        if (fs.existsSync(resumePath)) {
          await fs.promises.unlink(resumePath);
        }
      }

      sendError(res, err.message, 401, errors.auth);
    }
  } else {
    sendError(res, "undefined token", 400, errors.auth);
  }
}
