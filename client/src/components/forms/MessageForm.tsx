import { useRef, useState } from "react";
import { LuSend, LuImagePlus, LuX } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { EmojiClickData } from "emoji-picker-react";
import Input from "../Input";
import Button from "../Button";
import { MessageFormData } from "@/types";

import { useCreateMessage } from "@/hooks/messages/useCreateMessage";

import EmojiSelector from "../EmojiSelector";

interface MessageFormProps {
  conversationId: string;
}

const MessageForm = ({ conversationId }: MessageFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { mutate: createMessage, isPending } = useCreateMessage(conversationId);

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<MessageFormData>({
      defaultValues: { text: "" },
      mode: "onChange"
    });

  const currentText = watch("text");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview("");
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const input = inputRef.current;
    const startPos = input?.selectionStart || 0;
    const endPos = input?.selectionEnd || 0;
    const newText =
      currentText.substring(0, startPos) +
      emoji +
      currentText.substring(endPos);
    setValue("text", newText);
    input?.focus();
  };

  const onSubmit = (data: MessageFormData) => {
    const formData = new FormData();
    formData.append("text", data.text);
    if (imageFile) formData.append("image", imageFile);

    createMessage(formData, {
      onSuccess: () => {
        reset();
        setImageFile(null);
        setImagePreview("");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-14 md:pb-0 w-full">
      {imagePreview && (
        <div className="relative mb-2 flex items-center justify-center">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-40 rounded-lg object-contain"
          />
          <Button
            type="button"
            variant="danger"
            size="icon"
            className="absolute top-2 right-2 rounded-full"
            onClick={handleDeleteImage}
          >
            <LuX className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          {...register("text")}
          className="flex-1"
        />
        <EmojiSelector
          onEmojiClick={handleEmojiClick}
          horizontalAlign="right"
          verticalAlign="bottom"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="muted"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <LuImagePlus className="w-5 h-5" />
        </Button>
        <Button
          type="submit"
          size="icon"
          variant="primary"
          disabled={isPending || (!currentText?.trim() && !imageFile)}
        >
          <LuSend className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};

export default MessageForm;
