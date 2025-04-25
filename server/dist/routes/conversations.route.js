"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verityToken_1 = __importDefault(require("../middleware/verityToken"));
const conversations_controller_1 = require("../controllers/conversations.controller");
const router = express_1.default.Router();
router.get("/", verityToken_1.default, conversations_controller_1.getUserConversations);
router.get("/:conversationId", verityToken_1.default, conversations_controller_1.getConversationById);
router.post("/", verityToken_1.default, conversations_controller_1.createConversation);
router.delete("/:conversationId", verityToken_1.default, conversations_controller_1.deleteConversation);
exports.default = router;
