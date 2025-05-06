import { Request, Response } from "express";
import { NotificationType, Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { deleteImage, uploadSingleImage } from "../lib/handleImage";
import { getIO } from "../lib/socket";

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        avatarImage: true,
        coverImage: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            followings: true
          }
        },
        notificationsReceived: {
          where: {
            isRead: false
          },
          select: {
            id: true,
            type: true,
            isRead: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("getCurrentUser error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        avatarImage: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            followings: true
          }
        }
      }
    });

    if (users.length === 0) {
      res.status(404).json({ message: "No users" });
      return;
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("getUsers error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        avatarImage: true,
        coverImage: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            followers: true,
            followings: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("getUserProfile error:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

export const getSuggestedUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const following = await prisma.follow.findMany({
      where: {
        followerId: userId
      },
      select: {
        followingId: true
      }
    });

    const excludedIds = [...following.map((f) => f.followingId), userId];

    const availableUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: excludedIds
        }
      },
      select: {
        id: true
      }
    });

    if (availableUsers.length === 0) {
      res.status(200).json({ suggestedUsers: [] });
      return;
    }

    const shuffled = [...availableUsers].sort(() => 0.5 - Math.random());
    const randomFiveIds = shuffled.slice(0, 5).map((user) => user.id);

    const suggestedUsers = await prisma.user.findMany({
      where: {
        id: {
          in: randomFiveIds
        }
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarImage: true,
        _count: {
          select: {
            followers: true,
            followings: true
          }
        }
      }
    });

    res.status(200).json({ suggestedUsers });
  } catch (error) {
    console.error("getSuggestedUsers error:", error);
    res.status(500).json({ message: "Failed to fetch suggested users" });
  }
};

export const getFollowingUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const followingUsers = await prisma.follow.findMany({
      where: {
        followerId: userId
      },
      select: {
        followingId: true
      }
    });

    const followingIds = followingUsers.map((f) => f.followingId);

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: followingIds
        }
      },
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

    res.status(200).json({ followingUsers: users });
  } catch (error) {
    console.error("getFollowingUsers error:", error);
    res.status(500).json({ message: "Failed to fetch following users" });
  }
};

export const getFollowerUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const followerUsers = await prisma.follow.findMany({
      where: {
        followingId: userId
      },
      select: {
        followerId: true
      }
    });

    const followerIds = followerUsers.map((f) => f.followerId);

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: followerIds
        }
      },
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

    res.status(200).json({ followerUsers: users });
  } catch (error) {
    console.error("getFollowerUsers error:", error);
    res.status(500).json({ message: "Failed to fetch follower users" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { firstName, lastName, username, bio } = req.body;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (username && username !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUser) {
        res.status(409).json({ message: "Username already taken" });
        return;
      }
    }

    let avatarImage: string | null = null;
    let coverImage: string | null = null;

    if (req.files) {
      const files = req.files as {
        avatarImage?: Express.Multer.File[];
        coverImage?: Express.Multer.File[];
      };

      if (files?.avatarImage) {
        const uploadedAvatar = await uploadSingleImage(files.avatarImage[0]);

        if (user.avatarImage && uploadedAvatar !== user.avatarImage) {
          await deleteImage(user.avatarImage);
        }

        avatarImage = uploadedAvatar;
      }

      if (files?.coverImage) {
        const uploadedCover = await uploadSingleImage(files.coverImage[0]);

        if (user.coverImage && uploadedCover !== user.coverImage) {
          await deleteImage(user.coverImage);
        }

        coverImage = uploadedCover;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        username: username || undefined,
        bio: bio || undefined,
        avatarImage: avatarImage ? avatarImage : undefined,
        coverImage: coverImage ? coverImage : undefined
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        bio: true,
        avatarImage: true,
        coverImage: true,
        email: true
      }
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("User update error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await prisma.user.delete({
      where: {
        id: userId
      }
    });

    if (user.avatarImage) {
      await deleteImage(user.avatarImage);
    }

    if (user.coverImage) {
      await deleteImage(user.coverImage);
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const toggleFollowUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const followerId = req.userId;
  const { followingId } = req.params;

  if (!followerId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (followerId === followingId) {
    res.status(400).json({ message: "You can't follow yourself" });
    return;
  }

  try {
    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (isFollowing) {
      // Unfollow the user if already following
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId
          }
        }
      });

      await prisma.notification.deleteMany({
        where: {
          senderId: followerId,
          recipientId: followingId,
          type: NotificationType.FOLLOW
        }
      });

      res.status(200).json({ message: "Unfollowed user successfully" });
    } else {
      // Follow the user if not already following
      const follow = await prisma.follow.create({
        data: {
          followerId,
          followingId
        }
      });

      const follower = await prisma.user.findUnique({
        where: {
          id: followerId
        },
        select: {
          username: true
        }
      });

      if (!follower) {
        res.status(404).json({ message: "Follower not found" });
        return;
      }

      const notification = await prisma.notification.create({
        data: {
          type: NotificationType.FOLLOW,
          senderId: followerId,
          recipientId: followingId,
          message: `${follower.username} started following you.`
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

      res
        .status(201)
        .json({ message: "Followed user successfully", follow, notification });
    }
  } catch (error) {
    console.error("Follow user error:", error);
    res.status(500).json({ message: "Failed to follow/unfollow user" });
  }
};
