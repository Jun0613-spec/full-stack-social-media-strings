"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const replies_controller_1 = require("../controllers/replies.controller");
const verityToken_1 = __importDefault(require("../middleware/verityToken"));
const router = express_1.default.Router();
router.get("/:postId", replies_controller_1.getRepliesByPostId);
router.post("/:postId", verityToken_1.default, replies_controller_1.createReply);
router.put("/:replyId", verityToken_1.default, replies_controller_1.editReply);
router.delete("/:replyId", verityToken_1.default, replies_controller_1.deleteReply);
exports.default = router;
