import Message from "../models/Message.js";

export const handleNewMessage = (socket, io) => async ({ chatId, content }) => {
  const message = await Message.create({
    chatId,
    sender: socket.userId,
    content,
    readBy: [{ user: socket.userId, seenAt: new Date() }]
  });

  const fullMessage = await Message.findById(message._id)
    .populate("sender", "username email")
    .populate("chatId");

  io.to(chatId).emit("messageReceived", fullMessage);
};

export const handleMessageDelivered = (socket) => async ({ chatId }) => {
  if (!chatId) return;

  const userId = socket.userId;

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

  socket.to(chatId).emit("messagesDelivered", {
    userId,
    chatId,
    deliveredAt: new Date(),
  });
};

export const handleMessageRead = (socket) => async ({ chatId }) => {
  if (!chatId) return;

  const userId = socket.userId;

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

  socket.to(chatId).emit("messagesRead", {
    userId,
    chatId,
    seenAt: new Date(),
  });
};