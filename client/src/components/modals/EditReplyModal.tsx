import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { EmojiClickData } from "emoji-picker-react";
import { format } from "date-fns";

import { useAuthStore } from "@/stores/authStore";
import { useEditReplyModalStore } from "@/stores/modals/replies/editReplyModalStore";

import Button from "../Button";
import EmojiSelector from "../EmojiSelector";
import Loader from "../Loader";
import UserAvatar from "../UserAvatar";

import { EditReplyFormData } from "@/types";

import { cn } from "@/lib/utils";

import { useEditReply } from "@/hooks/replies/useEditReply";
import { useGetPostByPostId } from "@/hooks/posts/useGetPostByPostId";

const EditReplyModal = () => {
  const { currentUser } = useAuthStore();
  const { isOpen, closeModal, replyId, postId, initialText } =
    useEditReplyModalStore();

  const { data: post } = useGetPostByPostId(postId || "");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const displayDate = new Date(
    post?.updatedAt && post?.updatedAt !== post?.createdAt
      ? post.updatedAt
      : post?.createdAt ?? new Date()
  );

  const formattedDate = format(displayDate, "dd MMM yy");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<EditReplyFormData>({
    defaultValues: {
      text: initialText ?? ""
    },
    mode: "onChange"
  });

  const currentText = watch("text");

  const { mutate: editReply, isPending } = useEditReply();

  useEffect(() => {
    if (isOpen) {
      reset({ text: initialText ?? "" });
    }
  }, [isOpen, initialText, reset]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [currentText]);

  if (!isOpen || !replyId) return null;

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = currentText || "";
      const newText = text.slice(0, start) + emoji + text.slice(end);
      setValue("text", newText);
    } else {
      setValue("text", (currentText || "") + emoji);
    }
  };

  const onSubmit = (data: EditReplyFormData) => {
    editReply(
      { replyId, text: data.text },
      {
        onSuccess: () => {
          reset();
          closeModal();
        }
      }
    );
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 bg-black/50 dark:bg-black/80 z-50 flex justify-center items-start pt-10 px-4"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl w-full max-w-xl shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-xl font-bold">Edit Reply to Post</h1>
          <Button
            variant="muted"
            size="icon"
            onClick={closeModal}
            className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <HiX className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="relative flex gap-3 pb-4 pl-2">
            <div className="relative">
              <UserAvatar src={post?.user.avatarImage} className="w-10 h-10" />
              <div className="absolute left-1/2 top-10 bottom-[-20px] w-[2px] bg-neutral-400 dark:bg-neutral-600 transform -translate-x-1/2" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <p className="font-bold text-sm">
                  {post?.user.firstName} {post?.user.lastName}
                </p>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                  @{post?.user.username}
                </p>
                <time
                  dateTime={displayDate.toISOString()}
                  title={displayDate.toLocaleString()}
                  className="text-neutral-500 dark:text-neutral-400 text-xs hover:underline flex items-center gap-1"
                >
                  • {formattedDate}
                  {post?.updatedAt !== post?.createdAt && (
                    <span className="text-neutral-400 dark:text-neutral-500">
                      (edited)
                    </span>
                  )}
                </time>
              </div>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                {post?.text}
              </p>
              <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                Replying to{" "}
                <span className="font-semibold text-neutral-600 dark:text-neutral-300">
                  @{post?.user.username}
                </span>
              </p>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="flex gap-4 pl-2">
              <UserAvatar
                src={currentUser?.avatarImage}
                className="w-10 h-10"
              />
              <div className="flex-1 flex flex-col gap-4">
                <textarea
                  {...register("text", {
                    required: "Reply text is required",
                    maxLength: {
                      value: 280,
                      message: "Reply must be 280 characters or less"
                    }
                  })}
                  ref={(e) => {
                    textareaRef.current = e;
                    register("text").ref(e);
                  }}
                  placeholder="Post your reply"
                  className="w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 text-lg placeholder:text-lg leading-tight min-h-[100px]"
                />
                {errors.text && (
                  <p className="text-red-500 dark:text-red-600 text-sm">
                    {errors.text.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-4 items-center ml-14">
                <EmojiSelector onEmojiClick={handleEmojiClick} align="left" />
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "text-sm",
                    currentText?.length > 260
                      ? "text-red-500 dark:text-red-600"
                      : "text-neutral-500 dark:text-neutral-400"
                  )}
                >
                  {currentText?.length || 0}/280
                </div>
                <Button
                  variant="primary"
                  type="submit"
                  size="sm"
                  className="rounded-full font-bold px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    isPending ||
                    !currentText ||
                    (currentText?.length || 0) > 280
                  }
                >
                  {isPending ? <Loader /> : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditReplyModal;
