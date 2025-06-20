export const handleJoinChat = (socket) => (chatId) => {
  socket.join(chatId);
  console.log(`User ${socket.userId} joined chat ${chatId}`);
};

export const handleTyping = (socket) => ({ chatId }) => {
  if (!chatId) return;
  socket.to(chatId).emit("typing", { userId: socket.userId });
};

export const handleStopTyping = (socket) => ({ chatId }) => {
  if (!chatId) return;
  socket.to(chatId).emit("stopTyping", { userId: socket.userId });
};



