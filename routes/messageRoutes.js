import express from "express";
import { sendMessage, getChatMessages, markMessagesAsRead, getUnreadMessageCount, markMessagesAsDelivered, deleteMessage } from "../controllers/messageController.js";
import authenticateUser from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.route("/").post(sendMessage);
router.route("/:chatId").get(getChatMessages);
router.route("/:messageId").delete(deleteMessage);

router.route("/unread/:chatId").get(getUnreadMessageCount);
router.route("/read/:chatId").put(markMessagesAsRead);
router.route("/deliver/:chatId").put(markMessagesAsDelivered);

export default router;
