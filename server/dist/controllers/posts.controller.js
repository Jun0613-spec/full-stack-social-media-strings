"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.editPost = exports.createPost = exports.getPostByPostId = exports.getForYouFeed = exports.getFollowingFeed = void 0;
const prisma_1 = require("../lib/prisma");
const handleImage_1 = require("../lib/handleImage");
const getFollowingFeed = async (req, res) => {
    const { cursor } = req.query;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const take = 10;
    try {
        const posts = await prisma_1.prisma.post.findMany({
            where: {
                user: {
                    followers: {
                        some: {
                            followerId: userId
                        }
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
                cursor: { id: cursor },
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
                        id: true
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
            posts: trimmedPosts,
            nextCursor
        });
    }
    catch (error) {
        console.error("getFollowingFeed error:", error);
        res.status(500).json({ message: "Failed to fetch following feed" });
    }
};
exports.getFollowingFeed = getFollowingFeed;
const getForYouFeed = async (req, res) => {
    const { cursor } = req.query;
    const userId = req.userId;
    const take = 10;
    try {
        const posts = await prisma_1.prisma.post.findMany({
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
                        firstName: true,
                        lastName: true,
                        username: true,
                        avatarImage: true
                    }
                },
                ...(userId && {
                    likes: {
                        where: {
                            userId
                        },
                        select: {
                            id: true
                        }
                    }
                }),
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
            posts: trimmedPosts,
            nextCursor
        });
    }
    catch (error) {
        console.error("getForYouFeed error:", error);
        res.status(500).json({ message: "Failed to fetch for you feed" });
    }
};
exports.getForYouFeed = getForYouFeed;
const getPostByPostId = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await prisma_1.prisma.post.findUnique({
            where: { id: postId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        username: true,
                        avatarImage: true
                    }
                },
                likes: true,
                replies: true
            }
        });
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error("getPostByPostId error:", error);
        res.status(500).json({ message: "Failed to fetch post" });
    }
};
exports.getPostByPostId = getPostByPostId;
const createPost = async (req, res) => {
    const { text } = req.body;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const imageFiles = req.files;
        let images = [];
        if (imageFiles?.length) {
            images = await (0, handleImage_1.uploadImages)(imageFiles);
        }
        const newPost = await prisma_1.prisma.post.create({
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
    }
    catch (error) {
        console.error("createPost error:", error);
        res.status(500).json({ message: "Failed to create post" });
    }
};
exports.createPost = createPost;
const editPost = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const post = await prisma_1.prisma.post.findUnique({
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
        let newImages = null;
        const oldImages = post.images || [];
        const imageFiles = req.files;
        if (imageFiles?.length) {
            for (const image of oldImages) {
                await (0, handleImage_1.deleteImage)(image);
            }
            newImages = await (0, handleImage_1.uploadImages)(imageFiles);
        }
        const updatedPost = await prisma_1.prisma.post.update({
            where: { id: postId },
            data: {
                text: text || undefined,
                images: newImages || undefined
            },
            include: {
                user: true
            }
        });
        res.status(200).json({ message: "Post updated", updatedPost });
    }
    catch (error) {
        console.error("editPost error:", error);
        res.status(500).json({ message: "Failed to update post" });
    }
};
exports.editPost = editPost;
const deletePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const post = await prisma_1.prisma.post.findUnique({
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
                await (0, handleImage_1.deleteImage)(image);
            }
        }
        await prisma_1.prisma.post.delete({ where: { id: postId } });
        res.status(200).json({ message: "Post deleted", postId });
    }
    catch (error) {
        console.error("deletePost error:", error);
        res.status(500).json({ message: "Failed to delete post" });
    }
};
exports.deletePost = deletePost;
