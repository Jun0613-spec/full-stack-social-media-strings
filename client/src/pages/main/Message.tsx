import { useState, useEffect } from "react";

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

import { useConfirmModalStore } from "@/stores/modals/confirmModalStore";
import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";
import { useConversationStore } from "@/stores/conversationStore";

const MessagePage = () => {
  const { openModal: openConfirmModal } = useConfirmModalStore();
  const { currentUser } = useAuthStore();
  const { setIsMessagesPage, setCurrentConversationId } = useMessageStore();
  const { removeConversation } = useConversationStore();

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    setIsMessagesPage(true);
    setCurrentConversationId(selectedConversationId);

    return () => {
      setIsMessagesPage(false);
    };
  }, [selectedConversationId, setIsMessagesPage, setCurrentConversationId]);

  const { data: conversations = [], isLoading: conversationsLoading } =
    useGetConversations();
  const { data: selectedConversation } = useGetConversationById(
    selectedConversationId as string
  );
  const { data: messagesData, isLoading: isMessageLoading } =
    useGetMessagesByConversationId(selectedConversationId as string);

  const { mutate: deleteConversation } = useDeleteConversation();

  const messages = messagesData?.messages || [];

  const handleBackToConversations = () => {
    setSelectedConversationId(null);
  };

  const handleDeleteConversation = () => {
    if (selectedConversationId) {
      openConfirmModal({
        title: "Delete Conversation",
        message: "Are you sure you want to delete this conversation?",
        onConfirm: async () => {
          await deleteConversation(selectedConversationId, {
            onSuccess: () => {
              removeConversation(selectedConversationId);
              setSelectedConversationId(null);
            }
          });
        }
      });
    }
  };

  const isOwnMessage = (message: Message) => {
    return message.senderId === currentUser?.id;
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
              initialMessages={messages}
              isOwnMessage={isOwnMessage}
              conversationId={selectedConversationId}
              isLoading={isMessageLoading}
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
