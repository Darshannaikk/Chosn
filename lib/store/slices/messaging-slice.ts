import { createSlice, PayloadAction, createEntityAdapter } from '@reduxjs/toolkit';
import { Message, Conversation } from '@/lib/api/messaging';
import { arrayUtils } from '@/lib/utils/performance';

// Entity adapters for normalized state
const conversationsAdapter = createEntityAdapter<Conversation>();
const messagesAdapter = createEntityAdapter<Message>({
  sortComparer: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
});

interface MessagingState {
  conversations: ReturnType<typeof conversationsAdapter.getInitialState>;
  messages: Record<string, ReturnType<typeof messagesAdapter.getInitialState>>; // conversationId -> messages
  activeConversation: string | null;
  loading: boolean;
  sending: boolean;
  error: string | null;
  unreadCounts: Record<string, number>; // conversationId -> count
  lastActivity: Record<string, number>; // conversationId -> timestamp for sorting
}

const initialState: MessagingState = {
  conversations: conversationsAdapter.getInitialState(),
  messages: {},
  activeConversation: null,
  loading: false,
  sending: false,
  error: null,
  unreadCounts: {},
  lastActivity: {}
};

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      conversationsAdapter.setAll(state.conversations, action.payload);
      
      // Update unread counts and last activity efficiently
      action.payload.forEach(conv => {
        if (conv.unread_count !== undefined) {
          state.unreadCounts[conv.id] = conv.unread_count;
        }
        if (conv.last_message_at) {
          state.lastActivity[conv.id] = new Date(conv.last_message_at).getTime();
        }
      });
    },
    
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversation = action.payload;
      // Clear unread count for active conversation
      if (action.payload && state.unreadCounts[action.payload]) {
        state.unreadCounts[action.payload] = 0;
      }
    },
    
    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      const { conversationId, messages } = action.payload;
      
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = messagesAdapter.getInitialState();
      }
      
      messagesAdapter.setAll(state.messages[conversationId], messages);
    },
    
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const { conversationId, message } = action.payload;
      
      // Initialize messages state for conversation if needed
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = messagesAdapter.getInitialState();
      }
      
      // Add message using entity adapter (automatically sorted)
      messagesAdapter.addOne(state.messages[conversationId], message);
      
      // Update conversation's last message efficiently
      const conversation = state.conversations.entities[conversationId];
      if (conversation) {
        conversationsAdapter.updateOne(state.conversations, {
          id: conversationId,
          changes: {
            last_message: message,
            last_message_at: message.created_at
          }
        });
        
        // Update last activity for sorting
        state.lastActivity[conversationId] = new Date(message.created_at).getTime();
      }
      
      // Increment unread count if not active conversation
      if (state.activeConversation !== conversationId) {
        state.unreadCounts[conversationId] = (state.unreadCounts[conversationId] || 0) + 1;
      }
    },
    
    prependMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      const { conversationId, messages } = action.payload;
      
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = messagesAdapter.getInitialState();
      }
      
      // Add multiple messages efficiently
      messagesAdapter.addMany(state.messages[conversationId], messages);
    },
    
    updateConversation: (state, action: PayloadAction<Partial<Conversation> & { id: string }>) => {
      conversationsAdapter.updateOne(state.conversations, {
        id: action.payload.id,
        changes: action.payload
      });
    },
    
    updateMessage: (state, action: PayloadAction<{ conversationId: string; messageId: string; changes: Partial<Message> }>) => {
      const { conversationId, messageId, changes } = action.payload;
      
      if (state.messages[conversationId]) {
        messagesAdapter.updateOne(state.messages[conversationId], {
          id: messageId,
          changes
        });
      }
    },
    
    markMessagesAsRead: (state, action: PayloadAction<{ conversationId: string; messageIds: string[] }>) => {
      const { conversationId, messageIds } = action.payload;
      
      if (state.messages[conversationId]) {
        const updates = messageIds.map(id => ({
          id,
          changes: { read: true }
        }));
        
        messagesAdapter.updateMany(state.messages[conversationId], updates);
      }
      
      // Clear unread count
      state.unreadCounts[conversationId] = 0;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setSending: (state, action: PayloadAction<boolean>) => {
      state.sending = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearMessages: (state, action: PayloadAction<string>) => {
      delete state.messages[action.payload];
      delete state.unreadCounts[action.payload];
      delete state.lastActivity[action.payload];
    },
    
    removeConversation: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      conversationsAdapter.removeOne(state.conversations, conversationId);
      delete state.messages[conversationId];
      delete state.unreadCounts[conversationId];
      delete state.lastActivity[conversationId];
      
      if (state.activeConversation === conversationId) {
        state.activeConversation = null;
      }
    },
    
    resetMessaging: () => initialState
  }
});

export const {
  setConversations,
  setActiveConversation,
  setMessages,
  addMessage,
  prependMessages,
  updateConversation,
  updateMessage,
  markMessagesAsRead,
  setLoading,
  setSending,
  setError,
  clearMessages,
  removeConversation,
  resetMessaging
} = messagingSlice.actions;

// Memoized selectors for better performance
export const conversationsSelectors = conversationsAdapter.getSelectors();
export const messagesSelectors = messagesAdapter.getSelectors();

export default messagingSlice.reducer; 