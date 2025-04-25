import express from "express";

import {
  deleteUser,
  getCurrentUser,
  getFollowerUsers,
  getFollowingUsers,
  getSuggestedUsers,
  getUserProfile,
  getUsers,
  toggleFollowUser,
  updateUser
} from "../controllers/users.controller";

import verifyToken from "../middleware/verityToken";

import { upload } from "../config/multer";

const router = express.Router();

router.get("/current-user", verifyToken, getCurrentUser);
router.get("/profile/:username", getUserProfile);
router.get("/", getUsers);
router.put(
  "/",
  verifyToken,
  upload.fields([
    { name: "avatarImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  updateUser
);
router.delete("/", verifyToken, deleteUser);

router.get("/suggested", verifyToken, getSuggestedUsers);
router.get("/followings", verifyToken, getFollowingUsers);
router.get("/followers", verifyToken, getFollowerUsers);
router.post("/follow/:followingId", verifyToken, toggleFollowUser);

export default router;
