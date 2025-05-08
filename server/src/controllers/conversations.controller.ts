import { Request, Response } from "express";

import { prisma } from "../lib/prisma";
import { getIO } from "../lib/socket";

export const getUserConversations = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const conversations = await prisma.conversation.findMany({
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
          where: {
            id: {
              not: userId
            }
          },
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarImage: true
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc"
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarImage: true
              }
            }
          }
        }
      }
    });

    for (const conversation of conversations) {
      const lastMessage = await prisma.message.findFirst({
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
            sender: (
              await prisma.user.findUnique({
                where: {
                  id: lastMessage.senderId
                },
                select: {
                  username: true
                }
              })
            )?.username
          }
        : null;
    }

    res.status(200).json(conversations);
  } catch (error) {
    console.error("getUserConversations error:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

export const getConversationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { conversationId } = req.params;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const conversation = await prisma.conversation.findUnique({
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
          where: {
            id: {
              not: userId
            }
          },
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

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("getConversationById error:", error);
    res.status(500).json({ message: "Failed to fetch conversation" });
  }
};

export const createConversation = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    res.status(400).json({ message: "You can't send message to yourself" });
    return;
  }

  try {
    const participant = await prisma.user.findUnique({
      where: {
        id: participantId
      },
      select: {
        id: true
      }
    });

    if (!participant) {
      res.status(404).json({ message: "Participant not found" });
      return;
    }

    const existingConversation = await prisma.conversation.findFirst({
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

    const conversation = await prisma.conversation.create({
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

    const io = getIO();
    conversation.participants.forEach((participant) => {
      io.to(participant.id).emit("newConversation", conversation);
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error("createConversation error:", error);
    res.status(500).json({ message: "Failed to create conversation" });
  }
};

export const deleteConversation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { conversationId } = req.params;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const conversation = await prisma.conversation.findUnique({
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

    await prisma.message.deleteMany({
      where: {
        conversationId
      }
    });

    await prisma.conversation.delete({
      where: {
        id: conversationId
      }
    });

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("deleteConversation error:", error);
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};
