import jwt from "jsonwebtoken";

export default async function authUser(req, res, next) {
  const authToken = req.headers["authorization"];

  if (authToken !== undefined) {
    const header = authToken.split(" ");

    const token = header[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if(payload.role !== "Manager" || payload.role !== "Boss"){
        req.admin = payload;
        next();
      } else {
        res.status(403).json({message: "Unauthorized."})
      }
    } catch (err) {
      res.status(418).json(err.message)
    }
    
  } else {
    res.status(401).json({error: "undefined token."})
  }
}
