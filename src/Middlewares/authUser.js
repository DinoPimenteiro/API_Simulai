import jwt from "jsonwebtoken";

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
      sendError(res, err.message, 401, errors.auth);
    }
  } else {
    sendError(res, "undefined token", 400, errors.auth);
  }
}
