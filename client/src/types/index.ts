import { Post, Reply, User } from "./prismaTypes";

export enum NotificationType {
  LIKE_POST = "LIKE_POST",
  LIKE_REPLY = "LIKE_REPLY",
  REPLY = "REPLY",
  FOLLOW = "FOLLOW"
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  user: User;
}

export interface SearchUsersResponse {
  searchUsers: User[];
  nextCursor: string | null;
}

export interface SuggestedUsers {
  suggestedUsers: User[];
}

export interface ForYouFeedResponse {
  forYouFeed: Post[];
  nextCursor: string | null;
}

export interface FollowingsFeedResponse {
  followingsFeed: Post[];
  nextCursor: string | null;
}

export interface FollowingsResponse {
  followingUsers: User[];
}

export interface FollowersResponse {
  followerUsers: User[];
}

export interface repliesResponse {
  replies: Reply[];
  nextCursor: string | null;
}

export interface PostFormData {
  text: string;
  imageFiles: FileList;
  imageUrls: string[];
}

export interface EditPostFormData {
  text: string;
  imageFiles: FileList;
  imageUrls: string[];
}

export interface ReplyFormData {
  text: string;
}

export interface EditUserFormData {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  avatarImage?: File | null;
  coverImage?: File | null;
}
