import { format } from "date-fns";
import { BsCheck2All, BsCheck2 } from "react-icons/bs";

import UserAvatar from "@/components/UserAvatar";

import { Conversation } from "@/types/prismaTypes";

interface ConversationCardProps {
  conversation: Conversation;
  onClick: () => void;
}

const ConversationCard = ({ conversation, onClick }: ConversationCardProps) => {
  const otherParticipant = conversation.participants?.[0] || null;

  const lastMessage = conversation.lastMessage;

  return (
    <div
      onClick={onClick}
      className="p-4 border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer "
    >
      <div className="flex items-start gap-3">
        <UserAvatar
          src={otherParticipant?.avatarImage || ""}
          className="w-12 h-12"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold truncate">
              {otherParticipant?.firstName || ""}{" "}
              {otherParticipant?.lastName || ""}
            </h3>
            <span className="text-xs text-neutral-500 whitespace-nowrap">
              {conversation.updatedAt &&
                format(new Date(conversation.updatedAt), "h:mm a")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
              {lastMessage?.text || "No messages yet"}
            </p>
            {lastMessage?.senderId === otherParticipant?.id ? (
              lastMessage.seen ? (
                <BsCheck2All className="text-blue-500 dark:text-bleu-600" />
              ) : (
                <BsCheck2 className="text-neutral-500 dark:text-neutral-600" />
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
