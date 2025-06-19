import jwt from "jsonwebtoken";
import { jwt_secret } from "../config/envConfig.js";
import { createCustomError } from "../utils/customError.js";
import asyncWrapper from "./asyncWrapper.js";

const authenticateUser = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createCustomError("Authentication invalid", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwt_secret);
    req.user = { userId: decoded.id };
    next();
  } catch (error) {
    return next(createCustomError("Invalid or expired token", 401));
  }
});

export default authenticateUser;
