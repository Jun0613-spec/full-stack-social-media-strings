import { create } from "zustand";

import { Message } from "@/types/prismaTypes";

import { useConversationStore } from "./conversationStore";

interface MessageState {
  newMessageCount: number;
  isMessagesPage: boolean;
  currentConversationId: string | null;
  messages: Record<string, Message[]>;

  setIsMessagesPage: (isOnPage: boolean) => void;
  setCurrentConversationId: (conversationId: string | null) => void;

  setNewMessageCount: (count: number) => void;
  incrementMessageCount: () => void;
  decrementMessageCount: () => void;
  clearNewMessageCount: () => void;
  getDisplayMessageCount: () => number;

  getMessages: (conversationId: string) => Message[];
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, message: Message) => void;
  removeMessage: (conversationId: string, messageId: string) => void;
  markMessagesAsSeen: (conversationId: string, messageIds: string[]) => void;

  onMessageReceived: (message: Message) => void;
  onMessageSent: (message: Message) => void;
  onMessageUpdated: (message: Message) => void;
  onMessageRemoved: (conversationId: string, messageId: string) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  newMessageCount: 0,
  isMessagesPage: false,
  currentConversationId: null,
  messages: {},

  setIsMessagesPage: (isOnPage) => set({ isMessagesPage: isOnPage }),
  setCurrentConversationId: (conversationId) =>
    set({ currentConversationId: conversationId }),

  setNewMessageCount: (count) => set({ newMessageCount: count }),

  incrementMessageCount: () => {
    const { isMessagesPage } = get();
    if (!isMessagesPage) {
      set((state) => ({ newMessageCount: state.newMessageCount + 1 }));
    }
  },

  decrementMessageCount: () =>
    set((state) => ({
      newMessageCount: Math.max(0, state.newMessageCount - 1)
    })),

  clearNewMessageCount: () => set({ newMessageCount: 0 }),

  getDisplayMessageCount: () => {
    const { newMessageCount, isMessagesPage } = get();
    return isMessagesPage ? 0 : newMessageCount;
  },

  getMessages: (conversationId: string) => {
    const { messages } = get();
    return messages[conversationId] || [];
  },

  setMessages: (conversationId: string, newMessages: Message[]) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: newMessages
      }
    }));
  },

  addMessage: (conversationId: string, message: Message) => {
    set((state) => {
      const existingMessages = state.messages[conversationId] || [];
      const messageExists = existingMessages.some((m) => m.id === message.id);

      if (messageExists) return state;

      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existingMessages, message]
        }
      };
    });
  },

  updateMessage: (conversationId: string, updatedMessage: Message) => {
    set((state) => {
      const existingMessages = state.messages[conversationId] || [];
      const messageExists = existingMessages.some(
        (m) => m.id === updatedMessage.id
      );

      if (!messageExists) return state;

      return {
        messages: {
          ...state.messages,
          [conversationId]: existingMessages.map((message) =>
            message.id === updatedMessage.id
              ? { ...message, ...updatedMessage }
              : message
          )
        }
      };
    });
  },

  removeMessage: (conversationId: string, messageId: string) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).filter(
          (message) => message.id !== messageId
        )
      }
    }));
  },

  markMessagesAsSeen: (conversationId: string, messageIds: string[]) => {
    set((state) => {
      const existingMessages = state.messages[conversationId] || [];

      return {
        messages: {
          ...state.messages,
          [conversationId]: existingMessages.map((message) =>
            messageIds.includes(message.id) || messageIds.includes("all")
              ? { ...message, seen: true }
              : message
          )
        }
      };
    });
  },

  onMessageReceived: (message: Message) => {
    const { addMessage, incrementMessageCount, currentConversationId } = get();

    addMessage(message.conversationId, message);

    useConversationStore
      .getState()
      .updateConversationLastMessage(message.conversationId, message);

    if (message.conversationId !== currentConversationId) {
      incrementMessageCount();
    }
  },

  onMessageSent: (message: Message) => {
    const { addMessage } = get();

    addMessage(message.conversationId, message);

    useConversationStore
      .getState()
      .updateConversationLastMessage(message.conversationId, message);
  },

  onMessageUpdated: (message: Message) => {
    const { updateMessage } = get();

    updateMessage(message.conversationId, message);

    useConversationStore
      .getState()
      .updateConversationLastMessage(message.conversationId, message);
  },

  onMessageRemoved: (conversationId: string, messageId: string) => {
    const { removeMessage, decrementMessageCount } = get();

    removeMessage(conversationId, messageId);

    useConversationStore
      .getState()
      .updateConversationLastMessage(conversationId, null);

    decrementMessageCount();
  }
}));
