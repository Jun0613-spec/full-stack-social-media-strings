import { Request, Response } from "express";

import { prisma } from "../lib/prisma";
import { deleteImage, uploadImages } from "../lib/handleImage";

export const getUserPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username } = req.params;
  const { cursor } = req.query;

  const take = 5;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username
      },
      select: {
        id: true
      }
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: "desc"
      },
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor as string },
        skip: 1
      }),
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
    });

    const hasNextPage = posts.length > take;
    const trimmedPosts = hasNextPage ? posts.slice(0, take) : posts;
    const nextCursor = hasNextPage
      ? trimmedPosts[trimmedPosts.length - 1].id
      : null;

    res.status(200).json({
      userProfilePosts: trimmedPosts,
      nextCursor
    });
  } catch (error) {
    console.error("getUserPosts error:", error);
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
};

export const getFollowingsFeed = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cursor } = req.query;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const take = 5;

  try {
    const posts = await prisma.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: userId
            }
          },
          id: {
            not: userId
          }
        }
      },
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
        cursor: { id: cursor as string },
        skip: 1
      }),
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatarImage: true
          }
        },
        likes: {
          where: {
            userId
          },
          select: {
            id: true,
            userId: true,
            postId: true
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });

    const hasNextPage = posts.length > take;
    const trimmedPosts = hasNextPage ? posts.slice(0, take) : posts;
    const nextCursor = hasNextPage
      ? trimmedPosts[trimmedPosts.length - 1].id
      : null;

    res.status(200).json({
      followingsFeed: trimmedPosts,
      nextCursor
    });
  } catch (error) {
    console.error("getFollowingFeed error:", error);
    res.status(500).json({ message: "Failed to fetch following feed" });
  }
};

export const getForYouFeed = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cursor } = req.query;
  const userId = req.userId;

  const take = 5;

  try {
    const posts = await prisma.post.findMany({
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
        cursor: { id: cursor as string },
        skip: 1
      }),
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatarImage: true
          }
        },
        likes: {
          where: {
            userId
          },
          select: {
            id: true,
            userId: true,
            postId: true
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });

    const hasNextPage = posts.length > take;
    const trimmedPosts = hasNextPage ? posts.slice(0, take) : posts;
    const nextCursor = hasNextPage
      ? trimmedPosts[trimmedPosts.length - 1].id
      : null;

    res.status(200).json({
      forYouFeed: trimmedPosts,
      nextCursor
    });
  } catch (error) {
    console.error("getForYouFeed error:", error);
    res.status(500).json({ message: "Failed to fetch for you feed" });
  }
};

export const getPostByPostId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      include: {
        user: true,
        likes: true,
        replies: {
          orderBy: {
            createdAt: "desc"
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarImage: true
              }
            },
            likes: true,
            _count: {
              select: {
                likes: true
              }
            }
          }
        },
        _count: {
          select: {
            replies: true,
            likes: true
          }
        }
      }
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("getPostByPostId error:", error);
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { text } = req.body;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const imageFiles = req.files as Express.Multer.File[];
    let images: string[] = [];

    if (imageFiles?.length) {
      images = await uploadImages(imageFiles);
    }

    const newPost = await prisma.post.create({
      data: {
        text,
        images,
        userId
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

    res.status(201).json(newPost);
  } catch (error) {
    console.error("createPost error:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const editPost = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;
  const { text, clearImages } = req.body;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.userId !== userId) {
      res
        .status(403)
        .json({ message: "You are not allowed to edit this post" });
      return;
    }

    let newImages: string[] | null = null;
    const imageFiles = req.files as Express.Multer.File[];

    if (imageFiles?.length) {
      for (const image of post.images || []) {
        await deleteImage(image);
      }

      newImages = await uploadImages(imageFiles);
    } else if (clearImages === "true") {
      for (const image of post.images || []) {
        await deleteImage(image);
      }

      newImages = [];
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        text: text || undefined,
        images: newImages || undefined
      },
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });

    res.status(200).json({ message: "Post updated", updatedPost });
  } catch (error) {
    console.error("editPost error:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (
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
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.userId !== userId) {
      res.status(403).json({ message: "Not authorized to delete this post" });
      return;
    }

    if (post.images?.length) {
      for (const image of post.images) {
        await deleteImage(image);
      }
    }

    await prisma.post.delete({ where: { id: postId } });

    res.status(200).json({ message: "Post deleted", postId });
  } catch (error) {
    console.error("deletePost error:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
