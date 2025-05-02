import { format } from "date-fns";
import { Link } from "react-router-dom";
import { HiDotsHorizontal, HiHeart, HiOutlineHeart } from "react-icons/hi";
import { useState } from "react";
import { LuPencil, LuTrash } from "react-icons/lu";

import { cn } from "@/lib/utils";

import { Like, Reply } from "@/types/prismaTypes";

import UserAvatar from "@/components/UserAvatar";
import Button from "./Button";

import { useToggleLikeReply } from "@/hooks/replies/useToggleLikstReply";
import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";
import { useDeleteReply } from "@/hooks/replies/useDeleteReply";

import { useAuthStore } from "@/stores/authStore";
import { useEditReplyModalStore } from "@/stores/modals/replies/editReplyModalStore";
import { useConfirmModalStore } from "@/stores/modals/confirmModalStore";

interface ReplyCardProps {
  reply: Reply;
}

const ReplyCard = ({ reply }: ReplyCardProps) => {
  const { currentUser } = useAuthStore();
  const { openModal } = useEditReplyModalStore();
  const { openModal: openConfirmModal } = useConfirmModalStore();

  const { mutate: toggleLike } = useToggleLikeReply();
  const { mutate: deleteReply } = useDeleteReply();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useHandleOutsideClick({
    isOpen: isDropdownOpen,
    onClose: () => setIsDropdownOpen(false)
  });

  const isLiked = reply.likes?.some(
    (like: Like) => like.userId === currentUser?.id
  );

  const displayDate = new Date(
    reply.updatedAt && reply.updatedAt !== reply.createdAt
      ? reply.updatedAt
      : reply.createdAt
  );

  const formattedDate = format(displayDate, "dd MMM yyyy");

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsDropdownOpen((prev) => !prev);
  };

  const handleDeleteReply = (replyId: string) => {
    openConfirmModal({
      title: "Delete Reply",
      message: "Are you sure you want to delete this reply?",
      onConfirm: () => deleteReply(replyId)
    });
  };

  return (
    <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Link to={`/profile/${reply.user.username}`}>
            <UserAvatar src={reply.user.avatarImage} className="w-10 h-10" />
          </Link>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
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
                      className="absolute right-8 top-0 w-30 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50 bg-white dark:bg-black"
                    >
                      <button
                        className="w-full px-3 py-2 hover:bg-muted dark:hover:bg-neutral-900 flex items-center gap-4 text-sm transition duration-150 ease-in-out"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(reply.id, reply.text ?? "", reply.postId);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <LuPencil className="text-lg flex-shrink-0" />
                        <span className="truncate font-medium">Edit</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReply(reply.id);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 hover:bg-muted dark:hover:bg-neutral-900 flex items-center gap-4 text-sm border-t border-neutral-200 dark:border-neutral-800  text-red-500"
                      >
                        <LuTrash className="text-lg flex-shrink-0" />
                        <span className="truncate font-medium ">Delete</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
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
