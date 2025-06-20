import socketAuth from "../middlewares/socketAuth.js";
import Message from "../models/Message.js";

export const socketHandler = (io) => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.userId}`);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
    });

    socket.on("newMessage", async (data) => {
      const { chatId, content } = data;

      const message = await Message.create({
        chatId,
        sender: socket.userId,
        content,
      });

      const fullMessage = await Message.findById(message._id)
        .populate("sender", "username email")
        .populate("chatId");

      io.to(chatId).emit("messageReceived", fullMessage);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.userId}`);
    });
  });
};
