import Chat from "../models/Chat.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { createCustomError } from "../utils/customError.js";

export const accessPrivateChat = asyncWrapper(async (req, res, next) => {
  const { userId } = req.body;
  const { userId: currentUserId } = req.user;

  if (!userId) {
    return next(createCustomError("UserId is required", 400));
  }

  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [currentUserId, userId] },
  }).populate("users", "-password");

  if (chat) return res.status(200).json(chat);

  const newChat = await Chat.create({
    chatName: "Private Chat",
    isGroupChat: false,
    users: [currentUserId, userId],
  });

  const fullChat = await Chat.findById(newChat._id).populate("users", "-password");
  res.status(201).json(fullChat);
});

export const createGroupChat = asyncWrapper(async (req, res, next) => {
  const { name, users } = req.body;
  const { userId } = req.user;

  if (!name || !users || users.length < 2) {
    return next(createCustomError("Group chat requires name and at least 2 users", 400));
  }

  const groupUsers = [...users, userId];

  const groupChat = await Chat.create({
    chatName: name,
    isGroupChat: true,
    users: groupUsers,
    admin: userId,
  });

  const fullGroupChat = await Chat.findById(groupChat._id)
    .populate("users", "-password")
    .populate("admin", "-password");

  res.status(201).json(fullGroupChat);
});

export const getUserChats = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
    if (!userId) {
        return next(createCustomError("User ID is required", 400));
    }

  const chats = await Chat.find({ users: userId })
    .populate("users", "-password")
    .populate("admin", "-password")
    .sort({ updatedAt: -1 });

  res.status(200).json(chats);
});
