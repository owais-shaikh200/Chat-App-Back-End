import express from "express";
import { sendMessage, getChatMessages } from "../controllers/messageController.js";
import authenticateUser from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.route("/").post(sendMessage);
router.route("/:chatId").get(getChatMessages);

export default router;
