import jwt from "jsonwebtoken";

export const generateToken = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

export const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
