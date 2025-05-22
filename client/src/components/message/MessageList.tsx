import { useRef, useEffect } from "react";

import { Message } from "@/types/prismaTypes";

import { useMessageMarkAsSeen } from "@/hooks/messages/useMessageMarkAsSeen";

import { useSocketStore } from "@/stores/socketStore";
import { useMessageStore } from "@/stores/messageStore";

import MessageCard from "@/components/message/MessageCard";

import Loader from "@/components/Loader";

interface MessageListProps {
  initialMessages: Message[];
  isOwnMessage: (message: Message) => boolean;
  conversationId: string;
  isLoading: boolean;
}

const MessageList = ({
  initialMessages,
  isOwnMessage,
  conversationId,
  isLoading
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitiallyMarkedAsSeen = useRef<boolean>(false);

  const { markMessageAsSeen } = useSocketStore();
  const { getMessages, setMessages } = useMessageStore();

  const { mutate: markAsSeen } = useMessageMarkAsSeen(conversationId);

  const messages = getMessages(conversationId);

  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(conversationId, initialMessages);
    }
  }, [initialMessages, conversationId, setMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

      const unseenMessages = messages.filter(
        (message) => !message.seen && !isOwnMessage(message)
      );

      if (unseenMessages.length > 0 && !hasInitiallyMarkedAsSeen.current) {
        markAsSeen();
        hasInitiallyMarkedAsSeen.current = true;

        const senderId = unseenMessages[0].senderId;
        const messageIds = unseenMessages.map((message) => message.id);
        markMessageAsSeen(conversationId, messageIds, senderId);
      }
    }
  }, [messages, markAsSeen, isOwnMessage, conversationId, markMessageAsSeen]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>No messages yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-2 space-y-4">
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          isOwnMessage={isOwnMessage(message)}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
