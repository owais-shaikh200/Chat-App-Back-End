import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { createCustomError } from "../utils/customError.js";
import httpStatus from "../utils/httpStatus.js";

export const register = asyncWrapper(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(createCustomError("All fields are required", httpStatus.BAD_REQUEST));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createCustomError("Email already in use", httpStatus.BAD_REQUEST));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  res.status(httpStatus.CREATED).json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  });
});

export const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createCustomError("Email and password are required", httpStatus.BAD_REQUEST));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(createCustomError("Invalid credentials", httpStatus.UNAUTHORIZED));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(createCustomError("Invalid credentials", httpStatus.UNAUTHORIZED));
  }

  const token = generateToken(user._id);

  res.status(httpStatus.OK).json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  });
});
