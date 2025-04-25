"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("../controllers/users.controller");
const verityToken_1 = __importDefault(require("../middleware/verityToken"));
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
router.get("/current-user", verityToken_1.default, users_controller_1.getCurrentUser);
router.get("/profile/:username", users_controller_1.getUserProfile);
router.get("/", users_controller_1.getUsers);
router.put("/", verityToken_1.default, multer_1.upload.fields([
    { name: "avatarImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]), users_controller_1.updateUser);
router.delete("/", verityToken_1.default, users_controller_1.deleteUser);
router.get("/suggested", verityToken_1.default, users_controller_1.getSuggestedUsers);
router.get("/followings", verityToken_1.default, users_controller_1.getFollowingUsers);
router.get("/followers", verityToken_1.default, users_controller_1.getFollowerUsers);
router.post("/follow/:followingId", verityToken_1.default, users_controller_1.toggleFollowUser);
exports.default = router;
