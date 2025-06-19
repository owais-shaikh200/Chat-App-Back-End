import express from "express";
import connectDB from "./db/connection.js";
import { port } from "./config/envConfig.js";
import { errorHandlerMiddleware, notFoundError } from "./middlewares/errorHandler.js";
import { authRoutes, chatRoutes } from "./routes/index.js";

const app = express();

connectDB();

app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Chat App API!");
});

app.use(notFoundError);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
