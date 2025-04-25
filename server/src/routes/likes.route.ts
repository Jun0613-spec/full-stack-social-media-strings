import express from "express";

import verifyToken from "../middleware/verityToken";

import {
  toggleLikePost,
  toggleLikeReply
} from "../controllers/likes.controller";

const router = express.Router();

router.post("/post/:postId", verifyToken, toggleLikePost);
router.post("/reply/:replyId", verifyToken, toggleLikeReply);

export default router;
