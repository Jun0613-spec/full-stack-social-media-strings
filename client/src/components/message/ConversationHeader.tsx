import { FaArrowLeftLong } from "react-icons/fa6";
import { LuTrash } from "react-icons/lu";

import Button from "@/components/Button";

import { Conversation } from "@/types/prismaTypes";

interface ConversationHeaderProps {
  conversation: Conversation;
  onBack: () => void;
  onDelete: () => void;
}

const ConversationHeader = ({
  conversation,
  onBack,
  onDelete
}: ConversationHeaderProps) => {
  const participant = conversation.participants?.[0] || null;

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <Button onClick={onBack} variant="ghost" size="icon">
          <FaArrowLeftLong />
        </Button>
        <div className="flex flex-col items-start">
          <h2 className="font-bold text-sm">
            {participant?.firstName || "Unknown"}{" "}
            {participant?.lastName || "User"}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-netural-400">
            @{participant?.username || "unknown"}
          </p>
        </div>
      </div>
      <div>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <LuTrash className="w-5 h-5 text-red-500 dark:text-red-600" />
        </Button>
      </div>
    </div>
  );
};

export default ConversationHeader;
