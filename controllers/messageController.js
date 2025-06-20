import Message from "../models/Message.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { createCustomError } from "../utils/customError.js";

export const sendMessage = asyncWrapper(async (req, res, next) => {
  const { content, chatId } = req.body;
  const { userId } = req.user;

  if (!content || !chatId) {
    return next(createCustomError("Content and chatId are required", 400));
  }

  const message = await Message.create({
    sender: userId,
    content,
    chatId,
  });

  const fullMessage = await Message.findById(message._id)
    .populate("sender", "username email")
    .populate({
      path: "chatId",
      populate: {
        path: "users",
        select: "username email"
      }
    });

  res.status(201).json(fullMessage);
});


export const getChatMessages = asyncWrapper(async (req, res, next) => {
  const { chatId } = req.params;
    if (!chatId) {
        return next(createCustomError("Chat ID is required", 400));
    }

  const messages = await Message.find({ chatId })
    .populate("sender", "username email")
    .populate("chatId");

  res.status(200).json(messages);
});
