import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { query, take = "20", cursor } = req.query;

  if (!query || typeof query !== "string") {
    res.status(400).json({ message: "Query parameter is required" });
    return;
  }

  const trimmedQuery = query.trim();
  const takeNumber = parseInt(take as string, 10);

  const queryWords = trimmedQuery.split(" ").filter(Boolean);

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: queryWords.map((word) => ({
          OR: [
            {
              username: {
                contains: word,
                mode: "insensitive"
              }
            },
            {
              firstName: {
                contains: word,
                mode: "insensitive"
              }
            },
            {
              lastName: {
                contains: word,
                mode: "insensitive"
              }
            }
          ]
        }))
      },
      orderBy: {
        username: "asc"
      },
      take: takeNumber + 1,
      ...(cursor && {
        cursor: {
          id: cursor as string
        },
        skip: 1
      }),

      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarImage: true,
        bio: true,
        _count: {
          select: {
            followers: true,
            followings: true
          }
        }
      }
    });

    const hasNextPage = users.length > takeNumber;

    const trimmedUsers = hasNextPage ? users.slice(0, takeNumber) : users;

    const nextCursor = hasNextPage
      ? trimmedUsers[trimmedUsers.length - 1].id
      : null;

    res.status(200).json({
      searchUsers: trimmedUsers,
      nextCursor
    });
  } catch (error) {
    console.error("searchUsers error:", error);
    res.status(500).json({ message: "Failed to search users" });
  }
};
