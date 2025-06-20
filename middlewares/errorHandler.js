import {CustomAPIError} from "../utils/customError.js";
import httpStatus from "../utils/httpStatus.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error("Error:", err);
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .json({ msg: "Something went wrong, please try again" });
};
const notFoundError = (req, res) =>
  res.status(httpStatus.NOT_FOUND).send("Route does not exist");

export { notFoundError, errorHandlerMiddleware };