import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./db/connection.js";
import { port } from "./config/envConfig.js";
import { errorHandlerMiddleware, notFoundError } from "./middlewares/errorHandler.js";
import { authRoutes, chatRoutes, messageRoutes } from "./routes/index.js";
import { socketHandler } from "./socket/socketHandler.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});


connectDB();

app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Chat App API!");
});

app.use(notFoundError);
app.use(errorHandlerMiddleware);

socketHandler(io);

server.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
