import Chat from "../models/Chat.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { createCustomError } from "../utils/customError.js";
import HTTP_STATUS from "../utils/httpStatus.js";

export const accessPrivateChat = asyncWrapper(async (req, res, next) => {
  const { userId } = req.body;
  const { userId: currentUserId } = req.user;

  if (!userId) {
    return next(createCustomError("UserId is required", HTTP_STATUS.BAD_REQUEST));
  }

  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [currentUserId, userId] },
  }).populate("users", "-password");

  if (chat) return res.status(HTTP_STATUS.OK).json(chat);

  const newChat = await Chat.create({
    chatName: "Private Chat",
    isGroupChat: false,
    users: [currentUserId, userId],
  });

  const fullChat = await Chat.findById(newChat._id).populate("users", "-password");
  res.status(HTTP_STATUS.CREATED).json(fullChat);
});

export const createGroupChat = asyncWrapper(async (req, res, next) => {
  const { name, users } = req.body;
  const { userId } = req.user;

  if (!name || !users || users.length < 2) {
    return next(createCustomError("Group chat requires name and at least 2 users", HTTP_STATUS.BAD_REQUEST));
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

  res.status(HTTP_STATUS.CREATED).json(fullGroupChat);
});

export const getUserChats = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
    if (!userId) {
        return next(createCustomError("User ID is required", HTTP_STATUS.BAD_REQUEST));
    }

  const chats = await Chat.find({ users: userId })
    .populate("users", "-password")
    .populate("admin", "-password")
    .sort({ updatedAt: -1 });

  res.status(HTTP_STATUS.OK).json(chats);
});

export const leaveGroupChat = asyncWrapper(async (req, res, next) => {
  const { chatId } = req.params;
  const { userId } = req.user;

  const chat = await Chat.findById(chatId);

  if (!chat || !chat.isGroupChat) {
    return next(createCustomError("Group chat not found", HTTP_STATUS.NOT_FOUND));
  }

  if (!chat.users.includes(userId)) {
    return next(createCustomError("You are not a member of this group", HTTP_STATUS.BAD_REQUEST));
  }

  chat.users = chat.users.filter((id) => id.toString() !== userId);

  if (chat.groupAdmin?.toString() === userId) {
    if (chat.users.length > 0) {
      
      chat.groupAdmin = chat.users[0];
    } else {

      await Chat.findByIdAndDelete(chatId);
      return res.status(HTTP_STATUS.OK).json({ msg: "Group deleted as last user left" });
    }
  }

  await chat.save();
  res.status(HTTP_STATUS.OK).json({ msg: "You have left the group" });
});