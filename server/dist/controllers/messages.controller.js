"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMessagesAsSeen = exports.deleteMessage = exports.editMessage = exports.createMessage = exports.getMessages = void 0;
const prisma_1 = require("../lib/prisma");
const handleImage_1 = require("../lib/handleImage");
const socket_1 = require("../lib/socket");
const getMessages = async (req, res) => {
    const userId = req.userId;
    const { conversationId } = req.params;
    const { cursor } = req.query;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const take = 20;
    const skip = cursor ? parseInt(cursor) : 0;
    try {
        const conversation = await prisma_1.prisma.conversation.findUnique({
            where: {
                id: conversationId,
                participants: {
                    some: {
                        id: userId
                    }
                }
            }
        });
        if (!conversation) {
            res.status(403).json({ message: "Access to conversation denied" });
            return;
        }
        const messages = await prisma_1.prisma.message.findMany({
            where: {
                conversationId
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: take + 1,
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
        const nextCursor = messages.length > take ? skip + take : null;
        const resultMessages = messages.slice(0, take).reverse();
        res.status(200).json({
            messages: resultMessages,
            nextCursor
        });
    }
    catch (error) {
        console.error("getMessages error:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};
exports.getMessages = getMessages;
const createMessage = async (req, res) => {
    const { conversationId } = req.params;
    const { text } = req.body;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if (!text && !req.file) {
        res.status(400).json({ message: "text or image is required" });
        return;
    }
    try {
        const conversation = await prisma_1.prisma.conversation.findUnique({
            where: {
                id: conversationId,
                participants: {
                    some: {
                        id: userId
                    }
                }
            },
            include: {
                participants: true
            }
        });
        if (!conversation) {
            res.status(403).json({ message: "Access to conversation denied" });
            return;
        }
        let imageUrl = null;
        if (req.file) {
            imageUrl = await (0, handleImage_1.uploadSingleImage)(req.file);
        }
        const newMessage = await prisma_1.prisma.message.create({
            data: {
                text: text || null,
                image: imageUrl,
                conversationId,
                senderId: userId
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
        await prisma_1.prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessage: {
                    text: newMessage.text,
                    image: newMessage.image,
                    sender: newMessage.sender.username
                },
                updatedAt: new Date()
            }
        });
        const io = (0, socket_1.getIO)();
        conversation.participants.forEach((participant) => {
            io.to(participant.id).emit("newMessage", newMessage);
        });
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.error("createMessage error:", error);
        res.status(500).json({ message: "Failed to create message" });
    }
};
exports.createMessage = createMessage;
const editMessage = async (req, res) => {
    const { messageId } = req.params;
    const { text } = req.body;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const existingMessage = await prisma_1.prisma.message.findUnique({
            where: {
                id: messageId
            }
        });
        if (!existingMessage) {
            res.status(404).json({ message: "Message not found" });
            return;
        }
        if (existingMessage.senderId !== userId) {
            res
                .status(403)
                .json({ message: "You are not the sender of this message" });
            return;
        }
        let imageUrl = existingMessage.image;
        if (req.file) {
            if (existingMessage.image) {
                await (0, handleImage_1.deleteImage)(existingMessage.image);
            }
            imageUrl = await (0, handleImage_1.uploadSingleImage)(req.file);
        }
        const updatedMessage = await prisma_1.prisma.message.update({
            where: { id: messageId },
            data: {
                text: text || existingMessage.text,
                image: imageUrl
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
        await prisma_1.prisma.conversation.update({
            where: {
                id: existingMessage.conversationId
            },
            data: {
                lastMessage: {
                    text: updatedMessage.text,
                    image: updatedMessage.image,
                    sender: updatedMessage.sender.username
                },
                updatedAt: new Date()
            }
        });
        const conversation = await prisma_1.prisma.conversation.findUnique({
            where: { id: existingMessage.conversationId },
            include: {
                participants: {
                    select: { id: true }
                }
            }
        });
        const io = (0, socket_1.getIO)();
        conversation?.participants.forEach((participant) => {
            io.to(participant.id).emit("messageEdited", updatedMessage);
        });
        res.status(200).json(updatedMessage);
    }
    catch (error) {
        console.error("editMessage error:", error);
        res.status(500).json({ message: "Failed to edit message" });
    }
};
exports.editMessage = editMessage;
const deleteMessage = async (req, res) => {
    const userId = req.userId;
    const { messageId } = req.params;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const message = await prisma_1.prisma.message.findUnique({
            where: {
                id: messageId,
                senderId: userId
            }
        });
        if (!message) {
            res.status(404).json({ message: "Message not found or access denied" });
            return;
        }
        if (message.image) {
            await (0, handleImage_1.deleteImage)(message.image);
        }
        await prisma_1.prisma.message.delete({
            where: {
                id: messageId
            }
        });
        const lastMessage = await prisma_1.prisma.message.findFirst({
            where: {
                conversationId: message.conversationId
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 1
        });
        await prisma_1.prisma.conversation.update({
            where: {
                id: message.conversationId
            },
            data: {
                lastMessage: lastMessage
                    ? JSON.stringify({
                        text: lastMessage.text,
                        image: lastMessage.image,
                        sender: lastMessage.senderId
                    })
                    : JSON.stringify(null),
                updatedAt: new Date()
            }
        });
        res.status(200).json({ message: "Message deleted successfully" });
    }
    catch (error) {
        console.error("deleteMessage error:", error);
        res.status(500).json({ message: "Failed to delete message" });
    }
};
exports.deleteMessage = deleteMessage;
const markMessagesAsSeen = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const conversation = await prisma_1.prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                participants: {
                    select: {
                        id: true
                    }
                }
            }
        });
        if (!conversation) {
            res.status(403).json({ message: "Access to conversation denied" });
            return;
        }
        await prisma_1.prisma.message.updateMany({
            where: {
                conversationId,
                senderId: {
                    not: userId
                },
                seen: false
            },
            data: {
                seen: true
            }
        });
        const io = (0, socket_1.getIO)();
        conversation.participants.forEach((participant) => {
            io.to(participant.id).emit("messagesSeen", { conversationId });
        });
        res.status(200).json({ message: "Messages marked as seen" });
    }
    catch (error) {
        console.error("markMessagesAsSeen error:", error);
        res.status(500).json({ message: "Failed to mark messages as seen" });
    }
};
exports.markMessagesAsSeen = markMessagesAsSeen;
