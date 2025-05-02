import { EmojiClickData } from "emoji-picker-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import EmojiSelector from "../EmojiSelector";
import Button from "../Button";
import Loader from "../Loader";
import UserAvatar from "../UserAvatar";

import { ReplyFormData } from "@/types";

import { cn } from "@/lib/utils";

import { useAuthStore } from "@/stores/authStore";
import { useCreateReply } from "@/hooks/replies/useCreateReply";

interface ReplyFormProps {
  postId: string;
  username: string;
}

const ReplyForm = ({ postId, username }: ReplyFormProps) => {
  const { currentUser } = useAuthStore();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutate: createReply, isPending } = useCreateReply();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ReplyFormData>({
    defaultValues: { text: "" },
    mode: "onChange"
  });

  const currentText = watch("text");

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [currentText]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const textArea = textareaRef.current;

    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const text = currentText || "";
      const newText = text.substring(0, start) + emoji + text.substring(end);
      setValue("text", newText);
    }
  };

  const onSubmit = (formData: ReplyFormData) => {
    createReply(
      { postId, text: formData.text },
      {
        onSuccess: () => {
          reset();
          textareaRef.current?.focus();
        }
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-b border-neutral-200 dark:border-neutral-800 p-4"
    >
      <div className="flex gap-4">
        <UserAvatar src={currentUser?.avatarImage} className="w-10 h-10" />
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
            placeholder={`Reply to @${username}`}
            className="w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 placeholder:text-xs md:placeholder:text-sm leading-tight"
          />
          {errors.text && (
            <p className="text-red-500 dark:text-red-600 text-sm">
              {errors.text.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 ml-14">
        <div className="flex gap-4 items-center">
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
              isPending || !currentText || (currentText?.length || 0) > 280
            }
          >
            {isPending ? <Loader /> : "Reply"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReplyForm;
