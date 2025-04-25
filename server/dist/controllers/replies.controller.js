"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReply = exports.editReply = exports.createReply = exports.getRepliesByPostId = void 0;
const prisma_1 = require("../lib/prisma");
const types_1 = require("../types");
const getRepliesByPostId = async (req, res) => {
    const { postId } = req.params;
    const { cursor } = req.query;
    const take = 10;
    try {
        const replies = await prisma_1.prisma.reply.findMany({
            where: { postId },
            orderBy: [
                {
                    createdAt: "desc"
                },
                {
                    id: "desc"
                }
            ],
            take: take + 1,
            ...(cursor && {
                cursor: { id: cursor },
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
    }
    catch (error) {
        console.error("getRepliesByPostId error:", error);
        res.status(500).json({ message: "Failed to fetch replies" });
    }
};
exports.getRepliesByPostId = getRepliesByPostId;
const createReply = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const post = await prisma_1.prisma.post.findUnique({
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
        const reply = await prisma_1.prisma.reply.create({
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
            await prisma_1.prisma.notification.create({
                data: {
                    type: types_1.NotificationType.REPLY,
                    message: `${post.user.username} replied to your post.`,
                    senderId: userId,
                    recipientId: post.userId,
                    replyId: reply.id
                }
            });
        }
        res.status(201).json(reply);
    }
    catch (error) {
        console.error("createReply error:", error);
        res.status(500).json({ message: "Failed to create reply" });
    }
};
exports.createReply = createReply;
const editReply = async (req, res) => {
    const { replyId } = req.params;
    const { text } = req.body;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const existringReply = await prisma_1.prisma.reply.findUnique({
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
        const updatedReply = await prisma_1.prisma.reply.update({
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
    }
    catch (error) {
        console.error("editReply error:", error);
        res.status(500).json({ message: "Failed to edit reply" });
    }
};
exports.editReply = editReply;
const deleteReply = async (req, res) => {
    const { replyId } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const existingReply = await prisma_1.prisma.reply.findUnique({
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
        await prisma_1.prisma.reply.delete({
            where: {
                id: replyId
            }
        });
        res.status(200).json({ message: "Reply deleted successfully" });
    }
    catch (error) {
        console.error("deleteReply error:", error);
        res.status(500).json({ message: "Failed to deleted reply" });
    }
};
exports.deleteReply = deleteReply;
