"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verityToken_1 = __importDefault(require("../middleware/verityToken"));
const likes_controller_1 = require("../controllers/likes.controller");
const router = express_1.default.Router();
router.post("/post/:postId", verityToken_1.default, likes_controller_1.toggleLikePost);
router.post("/reply/:replyId", verityToken_1.default, likes_controller_1.toggleLikeReply);
exports.default = router;
