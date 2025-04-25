"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_controller_1 = require("../controllers/posts.controller");
const verityToken_1 = __importDefault(require("../middleware/verityToken"));
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
router.get("/following", verityToken_1.default, posts_controller_1.getFollowingFeed);
router.get("/for-you", posts_controller_1.getForYouFeed);
router.get("/:postId", posts_controller_1.getPostByPostId);
router.post("/", verityToken_1.default, multer_1.upload.array("images", 4), posts_controller_1.createPost);
router.put("/:postId", verityToken_1.default, multer_1.upload.array("images", 4), posts_controller_1.editPost);
router.delete("/:postId", verityToken_1.default, posts_controller_1.deletePost);
exports.default = router;
