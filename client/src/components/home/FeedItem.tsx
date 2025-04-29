import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { HiDotsHorizontal } from "react-icons/hi";
import { HiOutlineChatBubbleOvalLeft, HiOutlineHeart } from "react-icons/hi2";
import { LuDot, LuPencil, LuTrash } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

import UserAvatar from "@/components/UserAvatar";

import Button from "../Button";

import { cn } from "@/lib/utils";

import { useAuthStore } from "@/stores/authStore";

import { Post } from "@/types";

import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";

import { useEditPostModalStore } from "@/stores/modals/posts/editPostModalStore";
import { useDeletePost } from "@/hooks/posts/useDeletePost";
import { useConfirmModal } from "@/hooks/use-confirm";

interface FeedItemProps {
  post: Post;
}

export const FeedItem = ({ post }: FeedItemProps) => {
  const navigate = useNavigate();

  const { currentUser } = useAuthStore();
  const { openModal } = useEditPostModalStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useHandleOutsideClick({
    isOpen: isDropdownOpen,
    onClose: () => setIsDropdownOpen(false)
  });

  const { mutate: deletePost } = useDeletePost();

  const [ConfirmModal, confirm] = useConfirmModal(
    "Delete post",
    "Are you sure you want to delete this post?"
  );

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsDropdownOpen((prev) => !prev);
  };

  const createdAtDate = new Date(post.createdAt);

  const formattedDate = formatDistanceToNow(createdAtDate, {
    addSuffix: true
  });

  const handleClickPost = () => {
    navigate(`/post/${post.id}`);
  };

  const handleDeletePost = async (postId: string) => {
    const confirmed = await confirm();

    if (confirmed) {
      deletePost(postId);
    }
  };

  return (
    <>
      <ConfirmModal />
      <div
        onClick={handleClickPost}
        className="p-4 border-b border-neutral-200 dark:border-neutral-800 hover:bg-muted/20 dark:hiover:bg-muted/50 cursor-pointer"
      >
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0">
            <Link
              to={`/${post.user.username}`}
              onClick={(e) => e.stopPropagation()}
            >
              <UserAvatar src={post.user.avatarImage} className="w-10 h-10" />
            </Link>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-cetner space-x-1">
                <Link
                  to={`/${post.user.username}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:underline"
                >
                  <p className="font-bold text-sm lg:text-base">
                    {post.user.firstName} {post.user.lastName}
                  </p>
                </Link>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs lg:text-sm">
                  @{post.user.username}
                </p>

                <LuDot className="text-neutral-500 dark:text-neutral-400" />

                <time
                  dateTime={createdAtDate.toISOString()}
                  className="text-neutral-500 dark:text-neutral-400  text-xs lg:text-sm hover:underline"
                  title={createdAtDate.toLocaleString()}
                >
                  {formattedDate}
                </time>
              </div>

              {/* More Button */}
              <div className="relative" ref={dropdownRef}>
                {currentUser?.id === post.user.id && (
                  <>
                    <Button
                      variant="muted"
                      size="icon"
                      onClick={toggleDropdown}
                    >
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
                            openModal(post.id, post.text ?? "", post.images);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <LuPencil className="text-lg flex-shrink-0" />
                          <span className="truncate font-medium">Edit</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePost(post.id);
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

            <div className="mt-1 space-y-3">
              {post.text && (
                <p className="text-neutral-800 dark:text-neutral-200 break-words ">
                  {post.text}
                </p>
              )}

              {post.images.length > 0 && (
                <div
                  className={cn(
                    "grid gap-2 mt-2 rounded-xl overflow-hidden",
                    post.images.length === 1 ? "grid-cols-1" : "grid-cols-2",
                    post.images.length === 3 && "grid-rows-2"
                  )}
                >
                  {post.images.map((image, index) => (
                    <div
                      key={index}
                      className={cn(
                        " overflow-hidden group rounded-xl",
                        post.images.length === 1
                          ? "aspect-square"
                          : "aspect-square",
                        post.images.length === 3 &&
                          index === 0 &&
                          "row-span-2 aspect-auto"
                      )}
                    >
                      <img
                        src={image}
                        alt={`Post by ${post.user.username}`}
                        className="inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 text-muted-foreground text-sm ">
              <button
                onClick={() => {}}
                className="flex items-center space-x-1 hover:text-primary"
              >
                <HiOutlineChatBubbleOvalLeft className="w-4 h-4" />
                <span>{post._count?.replies}</span>
              </button>

              <button
                onClick={() => {}}
                className="flex items-center space-x-1 hover:text-primary"
              >
                <HiOutlineHeart className="w-4 h-4" />
                <span>{post._count?.likes}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedItem;
