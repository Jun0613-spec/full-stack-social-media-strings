import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaRegImage } from "react-icons/fa6";
import { HiX } from "react-icons/hi";
import { EmojiClickData } from "emoji-picker-react";

import { useEditPost } from "@/hooks/posts/useEditPost";

import Button from "../Button";
import Loader from "../Loader";
import EmojiSelector from "../EmojiSelector";
import UserAvatar from "../UserAvatar";

import { EditPostFormData } from "@/types";

import { MAX_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/stores/authStore";
import { useEditPostModalStore } from "@/stores/modals/posts/editPostModalStore";

const EditPostModal = () => {
  const { currentUser } = useAuthStore();
  const { isOpen, closeModal, postId, initialText } = useEditPostModalStore();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { mutate: editPost, isPending } = useEditPost();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<EditPostFormData>({
    defaultValues: {
      text: initialText ?? ""
    },
    mode: "onChange"
  });

  const currentText = watch("text");

  useEffect(() => {
    if (isOpen) {
      reset({ text: initialText ?? "" });

      setImageFiles([]);
    }
  }, [isOpen, initialText, reset]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [currentText]);

  if (!isOpen || !postId) return null;

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

  const onSubmit = (data: EditPostFormData) => {
    const formData = new FormData();

    formData.append("text", data.text);

    const noImagesLeft = imageFiles.length === 0;

    if (noImagesLeft) {
      formData.append("clearImages", "true");
    }

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    editPost(
      { postId, formData },
      {
        onSuccess: () => {
          imagePreviews.forEach((url) => URL.revokeObjectURL(url));
          reset();
          setImageFiles([]);
          setImagePreviews([]);
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
      className="fixed inset-0 bg-black/50 dark:bg-black/80 z-50 flex justify-center items-start pt-16"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl w-full max-w-xl mx-4 shadow-xl"
      >
        <div className="flex items-center justify-between p-2 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="ml-2 text-xl font-bold">Edit Post</h1>
          <Button
            variant="muted"
            size="icon"
            onClick={closeModal}
            className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <HiX className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <div className="flex gap-4">
            <UserAvatar src={currentUser?.avatarImage} className="size-12" />

            <div className="flex-1 flex flex-col gap-4">
              <textarea
                {...register("text", {
                  maxLength: {
                    value: 280,
                    message: "Text must be 280 characters or less"
                  }
                })}
                ref={(e) => {
                  textareaRef.current = e;
                  register("text").ref(e);
                }}
                maxLength={280}
                placeholder="What's on your mind?"
                className="w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 text-xl placeholder:text-xl leading-tight min-h-[100px]"
              />

              {errors.text && (
                <p className="text-red-500 dark:text-red-600 text-sm">
                  {errors.text.message}
                </p>
              )}

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {imagePreviews.map((url, index) => (
                    <div key={index} className="relative w-full aspect-square">
                      <img
                        src={url}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <Button
                        size="icon"
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
                      >
                        <HiX className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 ">
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
                    className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:text-muted-foreground"
                  >
                    <FaRegImage className="w-5 h-5 " />
                  </Button>

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
                      (!currentText?.trim() && imageFiles.length === 0) ||
                      (currentText?.length || 0) > 280
                    }
                  >
                    {isPending ? <Loader /> : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
