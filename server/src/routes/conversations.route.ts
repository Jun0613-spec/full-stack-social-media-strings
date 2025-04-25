import express from "express";

import verifyToken from "../middleware/verityToken";

import {
  createConversation,
  deleteConversation,
  getConversationById,
  getUserConversations
} from "../controllers/conversations.controller";

const router = express.Router();

router.get("/", verifyToken, getUserConversations);
router.get("/:conversationId", verifyToken, getConversationById);
router.post("/", verifyToken, createConversation);
router.delete("/:conversationId", verifyToken, deleteConversation);

export default router;
