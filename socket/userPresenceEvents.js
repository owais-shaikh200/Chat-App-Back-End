import User from "../models/User.js";
export const handleUserConnect = async (socket, io) => {
  try {
    await User.findByIdAndUpdate(socket.userId, { isOnline: true });
    socket.broadcast.emit("userOnline", { userId: socket.userId });
  } catch (error) {
    console.error("Error marking user online:", error.message);
  }
};

export const handleUserDisconnect = async (socket, io) => {
  try {
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: false,
      lastSeen: new Date(),
    });
    socket.broadcast.emit("userOffline", { userId: socket.userId });
  } catch (error) {
    console.error("Error marking user offline:", error.message);
  }
};
