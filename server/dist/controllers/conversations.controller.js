"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConversation = exports.createConversation = exports.getConversationById = exports.getUserConversations = void 0;
const prisma_1 = require("../lib/prisma");
const socket_1 = require("../lib/socket");
const getUserConversations = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const conversations = await prisma_1.prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        id: userId
                    }
                }
            },
            orderBy: {
                updatedAt: "desc"
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarImage: true
                    }
                }
            }
        });
        for (const conversation of conversations) {
            const lastMessage = await prisma_1.prisma.message.findFirst({
                where: {
                    conversationId: conversation.id
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            conversation.lastMessage = lastMessage
                ? {
                    text: lastMessage.text,
                    image: lastMessage.image,
                    sender: (await prisma_1.prisma.user.findUnique({
                        where: { id: lastMessage.senderId },
                        select: { username: true }
                    }))?.username
                }
                : null;
        }
        res.status(200).json(conversations);
    }
    catch (error) {
        console.error("getUserConversations error:", error);
        res.status(500).json({ message: "Failed to fetch conversations" });
    }
};
exports.getUserConversations = getUserConversations;
const getConversationById = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
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
                participants: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarImage: true
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    },
                    take: 50,
                    include: {
                        sender: {
                            select: {
                                id: true,
                                username: true,
                                avatarImage: true
                            }
                        }
                    }
                }
            }
        });
        if (!conversation) {
            res.status(404).json({ message: "Conversation not found" });
            return;
        }
        res.status(200).json(conversation);
    }
    catch (error) {
        console.error("getConversationById error:", error);
        res.status(500).json({ message: "Failed to fetch conversation" });
    }
};
exports.getConversationById = getConversationById;
const createConversation = async (req, res) => {
    const { participantId } = req.body;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if (!participantId || typeof participantId !== "string") {
        res.status(400).json({ message: "Valid participant ID is required" });
        return;
    }
    if (participantId === userId) {
        res
            .status(400)
            .json({ message: "Cannot create conversation with yourself" });
        return;
    }
    try {
        const participant = await prisma_1.prisma.user.findUnique({
            where: { id: participantId },
            select: { id: true }
        });
        if (!participant) {
            res.status(404).json({ message: "Participant not found" });
            return;
        }
        const existingConversation = await prisma_1.prisma.conversation.findFirst({
            where: {
                AND: [
                    {
                        participants: {
                            some: {
                                id: userId
                            }
                        }
                    },
                    {
                        participants: {
                            some: {
                                id: participantId
                            }
                        }
                    },
                    {
                        participants: {
                            every: {
                                id: {
                                    in: [userId, participantId]
                                }
                            }
                        }
                    }
                ]
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarImage: true
                    }
                }
            }
        });
        if (existingConversation) {
            res.status(200).json(existingConversation);
            return;
        }
        const conversation = await prisma_1.prisma.conversation.create({
            data: {
                participants: {
                    connect: [{ id: userId }, { id: participantId }]
                }
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarImage: true
                    }
                }
            }
        });
        const io = (0, socket_1.getIO)();
        conversation.participants.forEach((participant) => {
            io.to(participant.id).emit("newConversation", conversation);
        });
        res.status(201).json(conversation);
    }
    catch (error) {
        console.error("createConversation error:", error);
        res.status(500).json({ message: "Failed to create conversation" });
    }
};
exports.createConversation = createConversation;
const deleteConversation = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
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
            }
        });
        if (!conversation) {
            res.status(404).json({ message: "Conversation not found" });
            return;
        }
        await prisma_1.prisma.message.deleteMany({
            where: {
                conversationId
            }
        });
        await prisma_1.prisma.conversation.delete({
            where: {
                id: conversationId
            }
        });
        res.status(200).json({ message: "Conversation deleted successfully" });
    }
    catch (error) {
        console.error("deleteConversation error:", error);
        res.status(500).json({ message: "Failed to delete conversation" });
    }
};
exports.deleteConversation = deleteConversation;
