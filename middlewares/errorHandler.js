import {CustomAPIError} from "../utils/customError.js";
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(500)
    .json({ msg: "Something went wrong, please try again" });
};
const notFoundError = (req, res) =>
  res.status(404).send("Route does not exist");

export { notFoundError, errorHandlerMiddleware };