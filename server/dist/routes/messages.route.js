"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verityToken_1 = __importDefault(require("../middleware/verityToken"));
const messages_controller_1 = require("../controllers/messages.controller");
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
router.get("/:conversationId", verityToken_1.default, messages_controller_1.getMessages);
router.post("/:conversationId", verityToken_1.default, multer_1.upload.single("image"), messages_controller_1.createMessage);
router.put("/:messageId", verityToken_1.default, multer_1.upload.single("image"), messages_controller_1.editMessage);
router.delete("/:messageId", verityToken_1.default, messages_controller_1.deleteMessage);
router.put("/:conversationId/seen", verityToken_1.default, messages_controller_1.markMessagesAsSeen);
exports.default = router;
