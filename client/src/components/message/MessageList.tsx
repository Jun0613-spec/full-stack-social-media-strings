import { useRef, useEffect } from "react";

import { Message } from "@/types/prismaTypes";

import { useMessageMarkAsSeen } from "@/hooks/messages/useMessageMarkAsSeen";

import Loader from "@/components/Loader";
import MessageCard from "@/components/message/MessageCard";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isOwnMessage: (message: Message) => boolean;
  conversationId: string;
}

const MessageList = ({
  messages,
  isLoading,
  isOwnMessage,
  conversationId
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutate: markAsSeen } = useMessageMarkAsSeen(conversationId);
  const hasMarkedAsSeen = useRef(false);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });

      const hasUnread = messages.some((msg) => !msg.seen && !isOwnMessage(msg));

      if (hasUnread && !hasMarkedAsSeen.current) {
        markAsSeen();
        hasMarkedAsSeen.current = true;
      }
    }
  }, [messages, markAsSeen, isOwnMessage]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader />
      </div>
    );
  }

  if (messages.length === 0) {
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
