import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EmojiClickData } from "emoji-picker-react";
import { FaRegImage } from "react-icons/fa6";
import { HiX } from "react-icons/hi";

import UserAvatar from "@/components/UserAvatar";

import { useAuthStore } from "@/stores/authStore";

import Button from "../Button";
import Loader from "../Loader";

import EmojiSelector from "../EmojiSelector";

import { PostFormData } from "@/types";

import { MAX_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { useCreatePost } from "@/hooks/posts/useCreatePost";

const PostForm = () => {
  const { currentUser } = useAuthStore();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { mutate: createPost, isPending } = useCreatePost();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<PostFormData>({
    defaultValues: {
      text: ""
    },
    mode: "onChange"
  });

  const currentText = watch("text");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validImages = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length + validImages.length > MAX_FILES) {
      console.error(`You can only upload a maximum of ${MAX_FILES} images`);

      const availableSlots = MAX_FILES - imageFiles.length;

      if (availableSlots <= 0) return;

      const limitedValidImages = validImages.slice(0, availableSlots);

      const newPreviews = limitedValidImages.map((file) =>
        URL.createObjectURL(file)
      );

      setImageFiles((prev) => [...prev, ...limitedValidImages]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);

      return;
    }

    const newPreviews = validImages.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...validImages]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleDeleteImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);

    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const textArea = textareaRef.current;

    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const text = currentText || "";

      const newText = text.substring(0, start) + emoji + text.substring(end);
      setValue("text", newText);
    } else {
      setValue("text", (currentText || "") + emoji);
    }
  };

  const onSubmit = (data: PostFormData) => {
    const formData = new FormData();

    formData.append("text", data.text);
    imageFiles.forEach((file) => formData.append("images", file));

    createPost(formData, {
      onSuccess: () => {
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));

        reset();
        setImageFiles([]);
        setImagePreviews([]);
      }
    });
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [currentText]);

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <form className="p-4 flex gap-4" onSubmit={handleSubmit(onSubmit)}>
        <UserAvatar
          src={currentUser?.avatarImage}
          href={`/${currentUser?.username}`}
          className="size-12 hover:opacity-80 cursor-pointer"
        />

        <div className="flex-1 flex flex-col gap-4">
          <textarea
            {...register("text", {
              maxLength: {
                value: 280,
                message: "Text must be 100 characters or less"
              }
            })}
            ref={(event) => {
              textareaRef.current = event;

              const refCallback = register("text").ref;

              if (typeof refCallback === "function") {
                refCallback(event);
              }
            }}
            maxLength={280}
            placeholder="What's new?"
            className="w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 text-xl placeholder:text-lg lg:placeholder:text-xl leading-tight "
          />

          {errors.text && (
            <p className="text-red-500 text-sm">{errors.text.message}</p>
          )}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {imagePreviews.map((url, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-square overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <Button
                    size="icon"
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-2 p-2.5 rounded-full dark:text-white dark:bg-neutral-900 dark:hover:bg-neutral-900/80"
                  >
                    <HiX className="absolute w-2 h-2" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between gap-4 flex-wrap pt-4">
            <div className="flex gap-4 items-center relative">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                disabled={imageFiles.length >= MAX_FILES}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                size="icon"
                variant="muted"
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={imageFiles.length >= MAX_FILES}
                className="disabled:opacity-50 disabled:cursor-not-allowed  cursor-pointer hover:text-muted-foreground"
              >
                <FaRegImage className="w-5 h-5 " />
              </Button>

              <EmojiSelector onEmojiClick={handleEmojiClick} align="left" />
            </div>

            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "text-sm text-neutral-500 dark:text-neutral-400 ml-auto",
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
                size="md"
                className="py-1.5 rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  isPending || (!currentText?.trim() && imageFiles.length === 0)
                }
              >
                {isPending ? <Loader /> : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
