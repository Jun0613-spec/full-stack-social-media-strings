import { format } from "date-fns";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  HiHeart,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineHeart
} from "react-icons/hi2";
import { LuPencil, LuTrash } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

import UserAvatar from "@/components/UserAvatar";
import Button from "@/components/Button";
import { cn } from "@/lib/utils";
import { Post } from "@/types";
import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";
import { useDeletePost } from "@/hooks/posts/useDeletePost";
import { useAuthStore } from "@/stores/authStore";
import { useConfirmModalStore } from "@/stores/modals/confirmModalStore";
import { useEditPostModalStore } from "@/stores/modals/posts/editPostModalStore";
import { useToggleLikePost } from "@/hooks/posts/useToggleLikePost";
import { useState } from "react";

interface ReplyCardProps {
  reply: Post;
  showOriginalPost?: boolean;
}

export const ReplyCard = ({
  reply,
  showOriginalPost = false
}: ReplyCardProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { openModal } = useEditPostModalStore();
  const { openModal: openConfirmModal } = useConfirmModalStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useHandleOutsideClick({
    isOpen: isDropdownOpen,
    onClose: () => setIsDropdownOpen(false)
  });

  const { mutate: deletePost } = useDeletePost();
  const { mutate: toggleLikePost } = useToggleLikePost();

  const isLiked = reply.likes?.some((like) => like.userId === currentUser?.id);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const displayDate =
    reply.updatedAt !== reply.createdAt
      ? new Date(reply.updatedAt)
      : new Date(reply.createdAt);

  const formattedDate = format(displayDate, "dd MMM yy");

  const handleClickReply = () => {
    navigate(`/post/${reply.id}`);
  };

  const handleDeletePost = (postId: string) => {
    openConfirmModal({
      title: "Delete Reply",
      message: "Are you sure you want to delete this reply?",
      onConfirm: () => deletePost(postId)
    });
  };

  return (
    <div
      onClick={handleClickReply}
      className={cn(
        "p-4 border-b border-neutral-200 dark:border-neutral-800 hover:bg-muted/20 dark:hover:bg-muted/50 cursor-pointer",
        showOriginalPost ? "bg-muted/10 dark:bg-muted/20" : ""
      )}
    >
      {showOriginalPost && reply && (
        <div className="mb-3 ml-10 pl-4 border-l-2 border-neutral-300 dark:border-neutral-600">
          <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
            <span>Replying to</span>
            <Link
              to={`/${reply.user.username}`}
              onClick={(e) => e.stopPropagation()}
              className="text-blue-500 hover:underline"
            >
              @{reply.user.username}
            </Link>
          </div>
          <p className="text-sm truncate text-neutral-500 dark:text-neutral-400">
            {reply.text}
          </p>
        </div>
      )}

      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0">
          <Link
            to={`/${reply.user.username}`}
            onClick={(e) => e.stopPropagation()}
          >
            <UserAvatar src={reply.user.avatarImage} className="w-10 h-10" />
          </Link>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Link
                to={`/${reply.user.username}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:underline"
              >
                <p className="font-bold text-xs md:text-sm">
                  {reply.user.firstName} {reply.user.lastName}
                </p>
              </Link>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] md:text-xs">
                @{reply.user.username}
              </p>
              <time
                dateTime={displayDate.toISOString()}
                title={displayDate.toLocaleString()}
                className="text-neutral-500 dark:text-neutral-400 text-[11px] md:text-xs hover:underline flex items-center gap-1"
              >
                • {formattedDate}
                {reply.updatedAt !== reply.createdAt && (
                  <span className="text-neutral-400 dark:text-neutral-500">
                    (edited)
                  </span>
                )}
              </time>
            </div>

            {/* More Button */}
            <div className="relative" ref={dropdownRef}>
              {currentUser?.id === reply.user.id && (
                <>
                  <Button variant="muted" size="icon" onClick={toggleDropdown}>
                    <HiDotsHorizontal className="w-4 h-4" />
                  </Button>
                  {isDropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 w-30 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50 bg-white dark:bg-black"
                    >
                      <button
                        className="w-full px-3 py-2 hover:bg-muted dark:hover:bg-neutral-900 flex items-center gap-4 text-sm transition duration-150 ease-in-out"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(reply.id, reply.text ?? "", reply.images);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <LuPencil className="text-lg flex-shrink-0" />
                        <span className="truncate font-medium">Edit</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(reply.id);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 hover:bg-muted dark:hover:bg-neutral-900 flex items-center gap-4 text-sm border-t border-neutral-200 dark:border-neutral-800 text-red-500"
                      >
                        <LuTrash className="text-lg flex-shrink-0" />
                        <span className="truncate font-medium">Delete</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-1 space-y-3">
            <p className="text-neutral-800 dark:text-neutral-200 break-words">
              {reply.text}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-3 text-muted-foreground text-xs md:text-sm">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/post/${reply.id}/reply`);
              }}
              className="flex items-center gap-1.5 hover:text-primary cursor-pointer"
            >
              <HiOutlineChatBubbleOvalLeft className="w-4 h-4" />
              <span>{reply._count?.replies || 0}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLikePost(reply.id);
              }}
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
