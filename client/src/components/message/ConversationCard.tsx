import { format } from "date-fns";
import { useEffect } from "react";

import UserAvatar from "@/components/UserAvatar";

import { Conversation } from "@/types/prismaTypes";

import { useSocketStore } from "@/stores/socketStore";
import { useConversationStore } from "@/stores/conversationStore";

interface ConversationCardProps {
  conversation: Conversation;
  onClick: () => void;
}

const ConversationCard = ({ conversation, onClick }: ConversationCardProps) => {
  const { onlineUsers } = useSocketStore();
  const { getConversation, setConversation } = useConversationStore();

  useEffect(() => {
    setConversation(conversation.id, conversation);
  }, [conversation, setConversation]);

  const currentConversation = getConversation(conversation.id) || conversation;

  const otherParticipant = currentConversation.participants?.[0] || null;
  const isOnline = otherParticipant
    ? onlineUsers.includes(otherParticipant.id)
    : false;

  const lastMessage = currentConversation.lastMessage;

  return (
    <div
      onClick={onClick}
      className="p-4 border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer "
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <UserAvatar
            src={otherParticipant?.avatarImage || ""}
            className="w-12 h-12"
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full border-2 border-white dark:border-neutral-800" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold truncate">
              {otherParticipant?.firstName || "Unknown"}{" "}
              {otherParticipant?.lastName || "User"}
            </h3>
            <span className="text-xs text-neutral-500 whitespace-nowrap">
              {currentConversation.updatedAt &&
                format(new Date(currentConversation.updatedAt), "h:mm a")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
              {lastMessage?.text || "No messages yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
