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
      res.status(418).json(err.message)
    }
    
  } else {
    res.status(401).json({error: "undefined token."})
  }
}
