import cron from "node-cron";

import { prisma } from "./prisma";

export const cronJob = cron.schedule("0 0 * * *", async () => {
  console.log("Starting scheduled cleanup of old read notifications");

  const deleteBefore = new Date();
  deleteBefore.setDate(deleteBefore.getDate() - 3); // 3 days

  try {
    const deleted = await prisma.notification.deleteMany({
      where: {
        isRead: true,
        createdAt: {
          lt: deleteBefore
        }
      }
    });

    console.log(
      `Deleted ${deleted.count} read notifications older than 3 days.`
    );
  } catch (error) {
    console.error("Error cleaning up notifications:", error);
  }
});
