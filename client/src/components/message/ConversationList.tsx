import Loader from "@/components/Loader";
import ConversationCard from "@/components/message/ConversationCard";

import { Conversation } from "@/types/prismaTypes";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  onSelectConversation: (id: string) => void;
}

const ConversationList = ({
  conversations,
  isLoading,
  onSelectConversation
}: ConversationListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h3 className="text-xl font-bold mb-2">No messages found</h3>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.id}
          conversation={conversation}
          onClick={() => onSelectConversation(conversation.id)}
        />
      ))}
    </div>
  );
};

export default ConversationList;
