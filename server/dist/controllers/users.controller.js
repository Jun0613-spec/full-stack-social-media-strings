"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFollowUser = exports.deleteUser = exports.updateUser = exports.getFollowerUsers = exports.getFollowingUsers = exports.getSuggestedUsers = exports.getUserProfile = exports.getUsers = exports.getCurrentUser = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
const handleImage_1 = require("../lib/handleImage");
const socket_1 = require("../lib/socket");
const getCurrentUser = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
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
    }
    catch (error) {
        console.error("getCurrentUser error:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
};
exports.getCurrentUser = getCurrentUser;
const getUsers = async (req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({
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
    }
    catch (error) {
        console.error("getUsers error:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
exports.getUsers = getUsers;
const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                username: username
            },
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
                        posts: true,
                        followers: true,
                        followings: true
                    }
                },
                posts: {
                    select: {
                        id: true,
                        text: true,
                        images: true,
                        createdAt: true,
                        updatedAt: true,
                        likes: true,
                        replies: true
                    },
                    orderBy: { createdAt: "desc" }
                }
            }
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error("getUserProfile error:", error);
        res.status(500).json({ message: "Failed to fetch user profile" });
    }
};
exports.getUserProfile = getUserProfile;
const getSuggestedUsers = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { cursor } = req.query;
    const take = 5;
    try {
        const following = await prisma_1.prisma.follow.findMany({
            where: {
                followerId: userId
            },
            select: {
                followingId: true
            }
        });
        const followingIds = following.map((f) => f.followingId);
        followingIds.push(userId);
        const suggestedUsers = await prisma_1.prisma.user.findMany({
            where: {
                id: {
                    notIn: followingIds
                }
            },
            orderBy: [
                {
                    id: "desc"
                }
            ],
            take: take + 1,
            ...(cursor && {
                cursor: { id: cursor },
                skip: 1
            }),
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
        const hasNextPage = suggestedUsers.length > take;
        const trimmedUsers = hasNextPage
            ? suggestedUsers.slice(0, take)
            : suggestedUsers;
        const nextCursor = hasNextPage
            ? trimmedUsers[trimmedUsers.length - 1].id
            : null;
        res.status(200).json({
            suggestedUsers: trimmedUsers,
            nextCursor
        });
    }
    catch (error) {
        console.error("getSuggestedUsers error:", error);
        res.status(500).json({ message: "Failed to fetch suggested users" });
    }
};
exports.getSuggestedUsers = getSuggestedUsers;
const getFollowingUsers = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { cursor } = req.query;
    const take = 5;
    try {
        const followingUsers = await prisma_1.prisma.follow.findMany({
            where: {
                followerId: userId
            },
            select: {
                id: true,
                followingId: true
            },
            orderBy: {
                createdAt: "desc"
            },
            take: take + 1,
            ...(cursor && {
                cursor: {
                    id: cursor
                },
                skip: 1
            })
        });
        const followingIds = followingUsers.map((f) => f.followingId);
        const users = await prisma_1.prisma.user.findMany({
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
        const hasNextPage = followingUsers.length > take;
        const trimmedUsers = hasNextPage ? users.slice(0, take) : users;
        const nextCursor = hasNextPage
            ? trimmedUsers[trimmedUsers.length - 1].id
            : null;
        res.status(200).json({
            followingUsers: trimmedUsers,
            nextCursor
        });
    }
    catch (error) {
        console.error("getFollowingUsers error:", error);
        res.status(500).json({ message: "Failed to fetch following users" });
    }
};
exports.getFollowingUsers = getFollowingUsers;
const getFollowerUsers = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { cursor } = req.query;
    const take = 5;
    try {
        const followerUsers = await prisma_1.prisma.follow.findMany({
            where: {
                followingId: userId
            },
            select: {
                id: true,
                followerId: true
            },
            orderBy: {
                createdAt: "desc"
            },
            take: take + 1,
            ...(cursor && {
                cursor: {
                    id: cursor
                },
                skip: 1
            })
        });
        const followerIds = followerUsers.map((f) => f.followerId);
        const users = await prisma_1.prisma.user.findMany({
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
        const hasNextPage = followerUsers.length > take;
        const trimmedUsers = hasNextPage ? users.slice(0, take) : users;
        const nextCursor = hasNextPage
            ? trimmedUsers[trimmedUsers.length - 1].id
            : null;
        res.status(200).json({
            followerUsers: trimmedUsers,
            nextCursor
        });
    }
    catch (error) {
        console.error("getFollowerUsers error:", error);
        res.status(500).json({ message: "Failed to fetch follower users" });
    }
};
exports.getFollowerUsers = getFollowerUsers;
const updateUser = async (req, res) => {
    const { firstName, lastName, username, bio } = req.body;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (username && username !== user.username) {
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: { username }
            });
            if (existingUser) {
                res.status(409).json({ message: "Username already taken" });
                return;
            }
        }
        let avatarImage = null;
        let coverImage = null;
        if (req.files) {
            const files = req.files;
            if (files?.avatarImage) {
                const uploadedAvatar = await (0, handleImage_1.uploadSingleImage)(files.avatarImage[0]);
                if (user.avatarImage && uploadedAvatar !== user.avatarImage) {
                    await (0, handleImage_1.deleteImage)(user.avatarImage);
                }
                avatarImage = uploadedAvatar;
            }
            if (files?.coverImage) {
                const uploadedCover = await (0, handleImage_1.uploadSingleImage)(files.coverImage[0]);
                if (user.coverImage && uploadedCover !== user.coverImage) {
                    await (0, handleImage_1.deleteImage)(user.coverImage);
                }
                coverImage = uploadedCover;
            }
        }
        const updatedUser = await prisma_1.prisma.user.update({
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
    }
    catch (error) {
        console.error("User update error:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        await prisma_1.prisma.user.delete({
            where: {
                id: userId
            }
        });
        if (user.avatarImage) {
            await (0, handleImage_1.deleteImage)(user.avatarImage);
        }
        if (user.coverImage) {
            await (0, handleImage_1.deleteImage)(user.coverImage);
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};
exports.deleteUser = deleteUser;
const toggleFollowUser = async (req, res) => {
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
        const isFollowing = await prisma_1.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });
        if (isFollowing) {
            // Unfollow the user if already following
            await prisma_1.prisma.follow.delete({
                where: { id: isFollowing.id }
            });
            await prisma_1.prisma.notification.deleteMany({
                where: {
                    senderId: followerId,
                    recipientId: followingId,
                    type: client_1.NotificationType.FOLLOW
                }
            });
            res.status(200).json({ message: "Unfollowed user successfully" });
        }
        else {
            // Follow the user if not already following
            const follow = await prisma_1.prisma.follow.create({
                data: {
                    followerId,
                    followingId
                }
            });
            const follower = await prisma_1.prisma.user.findUnique({
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
            const notification = await prisma_1.prisma.notification.create({
                data: {
                    type: client_1.NotificationType.FOLLOW,
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
            const io = (0, socket_1.getIO)();
            io.emit("sendNotification", notification);
            res
                .status(201)
                .json({ message: "Followed user successfully", follow, notification });
        }
    }
    catch (error) {
        console.error("Follow user error:", error);
        res.status(500).json({ message: "Failed to follow/unfollow user" });
    }
};
exports.toggleFollowUser = toggleFollowUser;
