import { useState } from "react";

import Header from "@/components/Header";
import MessageForm from "@/components/forms/MessageForm";
import ConversationHeader from "@/components/message/ConversationHeader";
import ConversationList from "@/components/message/ConversationList";
import MessageList from "@/components/message/MessageList";

import { Message } from "@/types/prismaTypes";

import { useGetConversations } from "@/hooks/conversations/useGetConversations";
import { useGetConversationById } from "@/hooks/conversations/useGetConversationById";
import { useDeleteConversation } from "@/hooks/conversations/useDeleteConversation";
import { useGetMessagesByConversationId } from "@/hooks/messages/useGetMessagesByConversationId";

const MessagePage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const { data: conversations = [], isLoading: conversationsLoading } =
    useGetConversations();

  const { data: selectedConversation } = useGetConversationById(
    selectedConversationId as string
  );

  const { data: messagesData, isLoading: messagesLoading } =
    useGetMessagesByConversationId(selectedConversationId as string);

  const { mutate: deleteConversation } = useDeleteConversation();

  const messages = messagesData?.messages || [];

  const handleBackToConversations = () => {
    setSelectedConversationId(null);
  };

  const handleDeleteConversation = () => {
    if (selectedConversationId) {
      deleteConversation(selectedConversationId, {
        onSuccess: () => {
          setSelectedConversationId(null);
        }
      });
    }
  };

  const isOwnMessage = (message: Message) => {
    return message.senderId !== selectedConversation?.participants?.[0]?.id;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
        {selectedConversation ? (
          <ConversationHeader
            conversation={selectedConversation}
            onBack={handleBackToConversations}
            onDelete={handleDeleteConversation}
          />
        ) : (
          <Header label="Messages" />
        )}
      </div>

      {/* Main Content */}
      {!selectedConversationId ? (
        <ConversationList
          conversations={conversations}
          isLoading={conversationsLoading}
          onSelectConversation={setSelectedConversationId}
        />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto" id="messageContainer">
            <MessageList
              messages={messages}
              isLoading={messagesLoading}
              isOwnMessage={isOwnMessage}
              conversationId={selectedConversationId}
            />
          </div>

          <div className="bottom-0 px-2 py-2.5 border-t border-neutral-200 dark:border-neutral-800 bg-background/80 backdrop-blur-sm">
            <MessageForm conversationId={selectedConversationId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
