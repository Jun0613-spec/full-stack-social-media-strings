"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = require("./prisma");
exports.cronJob = node_cron_1.default.schedule("0 0 * * *", async () => {
    console.log("Starting scheduled cleanup of old read notifications");
    const deleteBefore = new Date();
    deleteBefore.setDate(deleteBefore.getDate() - 3); // 3 days
    try {
        const deleted = await prisma_1.prisma.notification.deleteMany({
            where: {
                isRead: true,
                createdAt: {
                    lt: deleteBefore
                }
            }
        });
        console.log(`Deleted ${deleted.count} read notifications older than 3 days.`);
    }
    catch (error) {
        console.error("Error cleaning up notifications:", error);
    }
});
