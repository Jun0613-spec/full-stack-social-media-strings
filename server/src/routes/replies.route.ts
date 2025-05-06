import express from "express";

import {
  createReply,
  deleteReply,
  editReply,
  getRepliesByPostId,
  getUserReplies
} from "../controllers/replies.controller";

import verifyToken from "../middleware/verityToken";

const router = express.Router();

router.get("/profile/:username", getUserReplies);
router.get("/:postId", getRepliesByPostId);
router.post("/:postId", verifyToken, createReply);
router.put("/:replyId", verifyToken, editReply);
router.delete("/:replyId", verifyToken, deleteReply);

export default router;
