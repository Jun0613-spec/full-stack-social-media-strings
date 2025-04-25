import { Request, Response } from "express";

import { NotificationType } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { getIO } from "../lib/socket";

export const toggleLikePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId } = req.params;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const likedPost = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      },
      include: {
        post: true
      }
    });

    if (likedPost) {
      // If the post is already liked, unlike it

      if (!likedPost.post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      await prisma.like.delete({
        where: {
          id: likedPost.id
        }
      });

      await prisma.notification.deleteMany({
        where: {
          senderId: userId,
          recipientId: likedPost.post.userId,
          type: NotificationType.LIKE_POST
        }
      });

      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // If the post is not liked, like it
      const like = await prisma.like.create({
        data: {
          userId,
          postId
        }
      });

      const user = await prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          username: true
        }
      });

      const post = await prisma.post.findUnique({
        where: {
          id: postId
        },
        select: {
          userId: true
        }
      });

      if (!user || !post) {
        res.status(404).json({ message: "User or post not found" });
        return;
      }

      if (post.userId !== userId) {
        const notification = await prisma.notification.create({
          data: {
            type: NotificationType.LIKE_POST,
            senderId: userId,
            recipientId: post.userId,
            message: `${user.username} liked your post.`
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                avatarImage: true
              }
            }
          }
        });

        const io = getIO();
        io.emit("sendNotification", notification);
      }

      res.status(201).json({ message: "Post liked successfully", like });
    }
  } catch (error) {
    console.error("likePost error:", error);
    res.status(500).json({ message: "Failed to like post" });
  }
};

export const toggleLikeReply = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { replyId } = req.params;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const likedReply = await prisma.like.findUnique({
      where: {
        userId_replyId: {
          userId,
          replyId
        }
      },
      include: {
        reply: true
      }
    });

    if (likedReply) {
      // Unlike the reply if the like already exists

      if (!likedReply.reply) {
        res.status(404).json({ message: "Reply not found" });
        return;
      }

      await prisma.like.delete({
        where: { id: likedReply.id }
      });

      await prisma.notification.deleteMany({
        where: {
          senderId: userId,
          recipientId: likedReply.reply.userId,
          type: NotificationType.LIKE_REPLY
        }
      });

      res.status(200).json({ message: "Reply unliked successfully" });
    } else {
      // Like the reply if the like doesn't exist
      const like = await prisma.like.create({
        data: {
          userId,
          replyId
        }
      });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true }
      });

      const reply = await prisma.reply.findUnique({
        where: { id: replyId },
        select: { userId: true }
      });

      if (!user || !reply) {
        res.status(404).json({ message: "User or reply not found" });
        return;
      }

      if (reply.userId !== userId) {
        const notification = await prisma.notification.create({
          data: {
            type: NotificationType.LIKE_REPLY,
            senderId: userId,
            recipientId: reply.userId,
            message: `${user.username} liked your reply.`
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                avatarImage: true
              }
            }
          }
        });

        const io = getIO();
        io.emit("sendNotification", notification);
      }

      res.status(201).json({ message: "Reply liked successfully", like });
    }
  } catch (error) {
    console.error("likeReply error:", error);
    res.status(500).json({ message: "Failed to toggle like on reply" });
  }
};
