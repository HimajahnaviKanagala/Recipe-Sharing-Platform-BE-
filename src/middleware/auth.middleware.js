import jwt from "jsonwebtoken";
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Token is Missing!" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Invalid Token", error.message);
  }
};
export default authenticate;
