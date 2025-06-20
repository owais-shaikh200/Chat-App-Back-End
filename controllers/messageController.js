import Message from "../models/Message.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { createCustomError } from "../utils/customError.js";
import httpStatus from "../utils/httpStatus.js";


export const sendMessage = asyncWrapper(async (req, res, next) => {
  const { content, chatId } = req.body;
  const { userId } = req.user;

  if (!content || !chatId) {
    return next(createCustomError("Content and chatId are required", httpStatus.BAD_REQUEST));
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

  res.status(httpStatus.CREATED).json(fullMessage);
});


export const getChatMessages = asyncWrapper(async (req, res, next) => {
  const { chatId } = req.params;
    if (!chatId) {
        return next(createCustomError("Chat ID is required", httpStatus.BAD_REQUEST));
    }

  const messages = await Message.find({ chatId })
    .populate("sender", "username email")
    .populate("chatId");

  res.status(httpStatus.OK).json(messages);
});

export const getUnreadMessageCount = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const { chatId } = req.params;

  const count = await Message.countDocuments({
    chatId,
    "readBy.user": { $ne: userId },
  });

  res.status(httpStatus.OK).json({ unreadCount: count });
});

export const markMessagesAsRead = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const { chatId } = req.params;

  await Message.updateMany(
    {
      chatId,
      "readBy.user": { $ne: userId },
    },
    {
      $addToSet: {
        readBy: { user: userId, seenAt: new Date() },
      },
    }
  );

  res.status(httpStatus.OK).json({ message: "Messages marked as read." });
});

export const markMessagesAsDelivered = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const { chatId } = req.params;

  await Message.updateMany(
    {
      chatId,
      "deliveredTo.user": { $ne: userId },
    },
    {
      $addToSet: {
        deliveredTo: { user: userId, deliveredAt: new Date() },
      },
    }
  );

  res.status(httpStatus.OK).json({ message: "Messages marked as delivered." });
});


export const deleteMessage = asyncWrapper(async (req, res, next) => {
  const { messageId } = req.params;
  const { userId } = req.user;

  const message = await Message.findById(messageId);

  if (!message) {
    return next(createCustomError("Message not found", httpStatus.NOT_FOUND));
  }

  if (message.sender.toString() !== userId) {
    return next(createCustomError("You can only delete your own messages", httpStatus.FORBIDDEN));
  }

  message.isDeleted = true;
  message.content = "This message was deleted";
  await message.save();

  res.status(httpStatus.OK).json({ msg: "Message deleted successfully", message });
});


