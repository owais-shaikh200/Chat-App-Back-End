import jwt from "jsonwebtoken";
import { jwt_secret, jwt_expiry } from "../config/envConfig.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwt_secret, {
    expiresIn: jwt_expiry || "1d",
  });
};

export default generateToken;
