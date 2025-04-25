"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notifications_controller_1 = require("../controllers/notifications.controller");
const verityToken_1 = __importDefault(require("../middleware/verityToken"));
const router = express_1.default.Router();
router.get("/", verityToken_1.default, notifications_controller_1.getNotifications);
router.patch("/:notificationId/read", verityToken_1.default, notifications_controller_1.markNotificationAsRead);
router.delete("/:notificationId", verityToken_1.default, notifications_controller_1.deleteNotification);
exports.default = router;
