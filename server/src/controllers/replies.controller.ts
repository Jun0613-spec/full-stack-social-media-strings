import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { NotificationType } from "../types";

export const getUserReplies = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username } = req.params;
  const { cursor } = req.query;

  const take = 5;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const replies = await prisma.reply.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor as string },
        skip: 1
      }),
      select: {
        id: true,
        text: true,
        createdAt: true,
        updatedAt: true,
        postId: true,
        likes: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarImage: true
          }
        },
        post: {
          select: {
            id: true,
            text: true,
            images: true,
            createdAt: true,
            updatedAt: true,
            likes: true,
            replies: true,
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarImage: true
              }
            },
            _count: {
              select: {
                likes: true,
                replies: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    });

    const hasNextPage = replies.length > take;
    const trimmedReplies = hasNextPage ? replies.slice(0, take) : replies;
    const nextCursor = hasNextPage
      ? trimmedReplies[trimmedReplies.length - 1].id
      : null;

    res.status(200).json({
      userProfileReplies: trimmedReplies,
      nextCursor
    });
  } catch (error) {
    console.error("getUserReplies error:", error);
    res.status(500).json({ message: "Failed to fetch user replies" });
  }
};

export const getRepliesByPostId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId } = req.params;

  const { cursor } = req.query;

  const take = 5;

  try {
    const replies = await prisma.reply.findMany({
      where: { postId },
      orderBy: [
        {
          createdAt: "asc"
        },
        {
          id: "desc"
        }
      ],
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor as string },
        skip: 1
      }),
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarImage: true,
            firstName: true,
            lastName: true
          }
        },
        likes: true,
        _count: {
          select: {
            likes: true
          }
        }
      }
    });

    const hasNextPage = replies.length > take;
    const trimmedReplies = hasNextPage ? replies.slice(0, take) : replies;
    const nextCursor = hasNextPage
      ? trimmedReplies[trimmedReplies.length - 1].id
      : null;

    res.status(200).json({ replies: trimmedReplies, nextCursor });
  } catch (error) {
    console.error("getRepliesByPostId error:", error);
    res.status(500).json({ message: "Failed to fetch replies" });
  }
};

export const createReply = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId } = req.params;

  const { text } = req.body;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      include: {
        user: true
      }
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const reply = await prisma.reply.create({
      data: {
        text,
        userId,
        postId
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            avatarImage: true
          }
        }
      }
    });

    if (post.userId !== userId) {
      await prisma.notification.create({
        data: {
          type: NotificationType.REPLY,
          message: `${post.user.username} replied to your post.`,
          senderId: userId,
          recipientId: post.userId,
          replyId: reply.id
        }
      });
    }

    res.status(201).json(reply);
  } catch (error) {
    console.error("createReply error:", error);
    res.status(500).json({ message: "Failed to create reply" });
  }
};

export const editReply = async (req: Request, res: Response): Promise<void> => {
  const { replyId } = req.params;

  const { text } = req.body;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const existringReply = await prisma.reply.findUnique({
      where: {
        id: replyId
      }
    });

    if (!existringReply) {
      res.status(404).json({ message: "Reply not found" });
      return;
    }

    if (existringReply.userId !== userId) {
      res
        .status(403)
        .json({ message: " You are not allowed to edit other's reply" });
      return;
    }

    const updatedReply = await prisma.reply.update({
      where: {
        id: replyId
      },
      data: {
        text
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            avatarImage: true
          }
        }
      }
    });

    res.status(200).json(updatedReply);
  } catch (error) {
    console.error("editReply error:", error);
    res.status(500).json({ message: "Failed to edit reply" });
  }
};

export const deleteReply = async (
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
    const existingReply = await prisma.reply.findUnique({
      where: {
        id: replyId
      }
    });

    if (!existingReply) {
      res.status(404).json({ message: "Reply not found" });
      return;
    }

    if (existingReply.userId !== userId) {
      res
        .status(403)
        .json({ message: " You are not allowed to delete other's reply" });
      return;
    }

    await prisma.reply.delete({
      where: {
        id: replyId
      }
    });

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    console.error("deleteReply error:", error);
    res.status(500).json({ message: "Failed to deleted reply" });
  }
};
