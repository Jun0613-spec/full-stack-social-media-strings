import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { BsCheck2All, BsCheck2 } from "react-icons/bs";
import { HiDotsHorizontal } from "react-icons/hi";
import { LuTrash, LuPencil } from "react-icons/lu";

import { cn } from "@/lib/utils";

import { Message } from "@/types/prismaTypes";

import { useEditMessage } from "@/hooks/messages/useEditMessage";
import { useDeleteMessage } from "@/hooks/messages/useDeleteMessage";
import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";

import Button from "@/components/Button";

import { useAuthStore } from "@/stores/authStore";
import { useConfirmModalStore } from "@/stores/modals/confirmModalStore";

interface MessageCardProps {
  message: Message;
  isOwnMessage: boolean;
}

const MessageCard = ({ message, isOwnMessage }: MessageCardProps) => {
  const { currentUser } = useAuthStore();
  const { openModal: openConfirmModal } = useConfirmModalStore();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState(message.text || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useHandleOutsideClick({
    isOpen: isDropdownOpen,
    onClose: () => setIsDropdownOpen(false)
  });

  const { mutate: editMessage } = useEditMessage(message.id);
  const { mutate: deleteMessage } = useDeleteMessage(message.id);

  const canEditDelete = currentUser?.id === message.senderId;
  const isEdited = !!message.textUpdatedAt;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      textareaRef.current.selectionEnd = textareaRef.current.value.length;
    }
  }, [isEditing]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleEdit = () => {
    setIsDropdownOpen(false);

    if (isEditing && editedText !== message.text) {
      const formData = new FormData();
      formData.append("text", editedText);

      editMessage(formData);
    }

    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    }
  };

  const handleDelete = () => {
    openConfirmModal({
      title: "Delete Message",
      message: "Are you sure you want to delete this message?",
      onConfirm: () => deleteMessage()
    });

    setIsDropdownOpen(false);
  };

  return (
    <div
      className={cn(
        "flex group w-full mb-3 px-4 items-center",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      {canEditDelete && (
        <div className="flex items-center h-full relative" ref={dropdownRef}>
          <Button
            variant="muted"
            size="icon"
            onClick={toggleDropdown}
            className={cn(
              isDropdownOpen
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            )}
          >
            <HiDotsHorizontal className="w-4 h-4" />
          </Button>
          {isDropdownOpen && (
            <div
              className={cn(
                "absolute right-8 w-40 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50 bg-white dark:bg-neutral-900"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="w-full px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-3 text-sm text-neutral-800 dark:text-neutral-200 transition-colors"
                onClick={handleEdit}
              >
                <LuPencil className="text-lg flex-shrink-0" />
                <span className="font-medium">Edit</span>
              </button>
              <button
                className="w-full px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-3 text-sm text-red-500 border-t border-neutral-100 dark:border-neutral-800 transition-colors"
                onClick={handleDelete}
              >
                <LuTrash className="text-lg" />
                <span className="font-medium">Delete</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-xl p-3 relative shadow-sm",
          isOwnMessage
            ? "bg-neutral-500 dark:bg-neutral-400 text-white rounded-br-none"
            : "bg-neutral-100 dark:bg-neutral-800 rounded-bl-none"
        )}
      >
        {isEditing ? (
          <>
            <textarea
              ref={textareaRef}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white dark:bg-neutral-700 text-black dark:text-white p-3 rounded-lg resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="danger"
                className="w-full"
                onClick={() => {
                  setIsEditing(false);
                  setEditedText(message.text);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                className="w-full"
                onClick={handleEdit}
              >
                Save
              </Button>
            </div>
          </>
        ) : (
          <>
            {message.text && (
              <div className="flex items-end gap-1">
                <p className="text-sm leading-tight">{message.text}</p>
                {isEdited && (
                  <span className="text-xs mt-0.5 text-neutral-400 dark:text-neutral-300 ">
                    (edited)
                  </span>
                )}
              </div>
            )}
            {message.image && (
              <div className="mt-2 rounded-xl overflow-hidden">
                <img
                  src={message.image}
                  alt="Message attachment"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </>
        )}

        <div
          className={cn(
            "flex items-center gap-1.5 mt-1.5",
            isOwnMessage ? "justify-end" : "justify-start"
          )}
        >
          <p
            className={cn(
              "text-xs",
              isOwnMessage
                ? "text-neutral-200 dark:text-neutral-100"
                : "text-neutral-500 dark:text-neutral-400"
            )}
          >
            {format(new Date(message.createdAt), "h:mm a")}
          </p>
          {isOwnMessage &&
            (message.seen ? (
              <BsCheck2All className="text-neutral-200 dark:text-neutral-100" />
            ) : (
              <BsCheck2 className="text-neutral-200 dark:text-neutral-100 opacity-70" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
