import express from "express";

import verifyToken from "../middleware/verityToken";

import {
  getMessages,
  createMessage,
  deleteMessage,
  markMessagesAsSeen,
  editMessage
} from "../controllers/messages.controller";

import { upload } from "../config/multer";

const router = express.Router();

router.get("/:conversationId", verifyToken, getMessages);
router.post(
  "/:conversationId",
  verifyToken,
  upload.single("image"),
  createMessage
);
router.put("/:messageId", verifyToken, upload.single("image"), editMessage);
router.delete("/:messageId", verifyToken, deleteMessage);
router.put("/seen/:conversationId", verifyToken, markMessagesAsSeen);

export default router;
