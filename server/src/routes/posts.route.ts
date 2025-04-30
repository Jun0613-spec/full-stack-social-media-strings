import express from "express";

import {
  getPostByPostId,
  createPost,
  editPost,
  deletePost,
  getForYouFeed,
  getFollowingsFeed
} from "../controllers/posts.controller";

import verifyToken from "../middleware/verityToken";

import { upload } from "../config/multer";

const router = express.Router();

router.get("/followings", verifyToken, getFollowingsFeed);
router.get("/for-you", getForYouFeed);
router.get("/:postId", getPostByPostId);
router.post("/", verifyToken, upload.array("images", 4), createPost);
router.put("/:postId", verifyToken, upload.array("images", 4), editPost);
router.delete("/:postId", verifyToken, deletePost);

export default router;
