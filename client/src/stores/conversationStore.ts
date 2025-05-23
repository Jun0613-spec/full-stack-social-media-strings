import { create } from "zustand";
import { Conversation, Message } from "@/types/prismaTypes";

interface ConversationState {
  conversations: Record<string, Conversation>;

  getConversation: (conversationId: string) => Conversation | null;

  setConversation: (conversationId: string, conversation: Conversation) => void;

  updateConversationLastMessage: (
    conversationId: string,
    message: Message | null
  ) => void;

  removeConversation: (conversationId: string) => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: {},

  getConversation: (conversationId: string) => {
    const { conversations } = get();

    return conversations[conversationId] || null;
  },

  setConversation: (conversationId: string, conversation: Conversation) => {
    set((state) => ({
      conversations: {
        ...state.conversations,
        [conversationId]: conversation
      }
    }));
  },

  updateConversationLastMessage: (
    conversationId: string,
    message: Message | null
  ) => {
    set((state) => {
      const conversation = state.conversations[conversationId];
      if (!conversation) return state;

      return {
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...conversation,
            lastMessage: message,
            updatedAt: message ? message.createdAt : conversation.updatedAt
          }
        }
      };
    });
  },

  removeConversation: (conversationId: string) => {
    set((state) => {
      const newConversations = { ...state.conversations };

      delete newConversations[conversationId];

      return { conversations: newConversations };
    });
  }
}));
