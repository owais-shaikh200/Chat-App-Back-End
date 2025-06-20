import express from "express";
import {
  accessPrivateChat,
  createGroupChat,
  getUserChats,
  leaveGroupChat
} from "../controllers/chatController.js";

import authenticateUser from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.route("/").get(getUserChats);
router.route("/private").post(accessPrivateChat);
router.route("/group").post(createGroupChat);
router.route("/group/:chatId/leave").delete(leaveGroupChat);

export default router;
