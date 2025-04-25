export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  avatarImage?: string | null;
  coverImage?: string | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;

  posts?: Post[];
  replies?: Reply[];
  followers?: Follow[];
  followings?: Follow[];
  likes?: Like[];
  messages?: Message[];
  conversations?: Conversation[];
  notificationsSent?: Notification[];
  notificationsReceived?: Notification[];
}

export interface Post {
  id: string;
  text?: string | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;

  userId: string;
  user: User;

  likes?: Like[];
  replies?: Reply[];
}

export interface Reply {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;

  userId: string;
  user: User;

  postId: string;
  post: Post;

  likes?: Like[];
  notifications?: Notification[];
}

export interface Follow {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  followerId: string;
  follower: User;

  followingId: string;
  following: User;

  notifications?: Notification[];
}

export interface Like {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  userId: string;
  user: User;

  postId?: string | null;
  post?: Post | null;

  replyId?: string | null;
  reply?: Reply | null;

  notifications?: Notification[];
}

export interface Conversation {
  id: string;
  lastMessage?: any | null;
  createdAt: Date;
  updatedAt: Date;

  participants?: User[];
  messages?: Message[];
}

export interface Message {
  id: string;
  text?: string | null;
  seen: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;

  conversationId: string;
  conversation: Conversation;

  senderId: string;
  sender: User;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;

  senderId: string;
  sender: User;

  recipientId: string;
  recipient: User;

  replyId?: string | null;
  reply?: Reply | null;

  followId?: string | null;
  follow?: Follow | null;

  likeId?: string | null;
  like?: Like | null;
}

export enum NotificationType {
  LIKE_POST = "LIKE_POST",
  LIKE_REPLY = "LIKE_REPLY",
  REPLY = "REPLY",
  FOLLOW = "FOLLOW"
}
