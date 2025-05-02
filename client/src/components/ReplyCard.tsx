import { format } from "date-fns";
import { Link } from "react-router-dom";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";

import UserAvatar from "@/components/UserAvatar";

import { cn } from "@/lib/utils";

import { Like, Reply } from "@/types/prismaTypes";

import { useAuthStore } from "@/stores/authStore";

import { useToggleLikeReply } from "@/hooks/replies/useToggleLikstReply";

interface ReplyCardProps {
  reply: Reply;
}

const ReplyCard = ({ reply }: ReplyCardProps) => {
  const { currentUser } = useAuthStore();

  const { mutate: toggleLike } = useToggleLikeReply();

  const isLiked = reply.likes?.some(
    (like: Like) => like.userId === currentUser?.id
  );

  const displayDate = new Date(
    reply.updatedAt && reply.updatedAt !== reply.createdAt
      ? reply.updatedAt
      : reply.createdAt
  );

  const formattedDate = format(displayDate, "dd MMM yy");

  return (
    <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Link to={`/profile/${reply.user.username}`}>
            <UserAvatar src={reply.user.avatarImage} className="w-10 h-10" />
          </Link>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1">
            <Link
              to={`/profile/${reply.user.username}`}
              className="hover:underline"
            >
              <p className="font-bold text-sm">
                {reply.user.firstName} {reply.user.lastName}
              </p>
            </Link>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs">
              @{reply.user.username}
            </p>
            <time
              dateTime={displayDate.toISOString()}
              title={displayDate.toLocaleString()}
              className="text-neutral-500 dark:text-neutral-400 text-xs hover:underline flex items-center gap-1"
            >
              • {formattedDate}
              {reply.updatedAt !== reply.createdAt && (
                <span className="text-neutral-400 dark:text-neutral-500">
                  (edited)
                </span>
              )}
            </time>
          </div>

          <p className="mt-1 text-neutral-800 dark:text-neutral-200">
            {reply.text}
          </p>

          <div className="flex items-center gap-4 mt-3 text-muted-foreground text-xs md:text-sm">
            <button
              onClick={() => toggleLike(reply.id)}
              className={cn(
                "flex items-center gap-1.5 cursor-pointer",
                isLiked
                  ? "text-red-500 dark:text-red-600 hover:text-red-600 dark:hover:text-red-500"
                  : "hover:text-primary"
              )}
            >
              {isLiked ? (
                <HiHeart className="w-4 h-4" />
              ) : (
                <HiOutlineHeart className="w-4 h-4" />
              )}
              <span>{reply._count?.likes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;
