import socketAuth from "../middlewares/socketAuth.js";
import {
  handleJoinChat,
  handleTyping,
  handleStopTyping,
} from "./chatEvents.js";

import { 
    handleNewMessage, 
    handleMessageRead, 
    handleMessageDelivered 
} from "./messageEvents.js";

import {
  handleUserConnect,
  handleUserDisconnect,
} from "./userPresenceEvents.js";

export const socketHandler = (io) => {
  io.use(socketAuth);

  io.on("connection", async (socket) => {
    console.log(`Socket connected: ${socket.userId}`);

    await handleUserConnect(socket, io);

    socket.on("joinChat", handleJoinChat(socket));
    socket.on("typing", handleTyping(socket));
    socket.on("stopTyping", handleStopTyping(socket));
    socket.on("newMessage", handleNewMessage(socket, io));
    socket.on("messageRead", handleMessageRead(socket));
    socket.on("messageDelivered", handleMessageDelivered(socket));
    

    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: ${socket.userId}`);
      await handleUserDisconnect(socket, io);
    });
  });
};
