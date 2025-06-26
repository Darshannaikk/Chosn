import { createClient } from '@/lib/supabase/client';
import { createServerClient } from '@/lib/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { emailService } from '@/lib/services/email';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  edited_at?: string;
  is_deleted: boolean;
  sender?: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    user_type: string;
  };
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  participants?: Array<{
    user_id: string;
    joined_at: string;
    last_read_at?: string;
    user: {
      id: string;
      email: string;
      full_name: string;
      avatar_url: string;
      user_type: string;
    };
  }>;
  last_message?: Message;
  unread_count?: number;
}

export interface ConversationParticipant {
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at?: string;
}

class MessagingService {
  private supabase = createClient();

  async getOrCreateConversation(otherUserId: string): Promise<string | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await this.supabase.rpc('get_or_create_conversation', {
        user1_id: user.id,
        user2_id: otherUserId
      });

      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getOrCreateConversation:', error);
      return null;
    }
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return [];

      // Get conversations with participants and last message
      const { data: conversations, error } = await this.supabase
        .from('conversations')
        .select(`
          id,
          created_at,
          updated_at,
          last_message_at,
          conversation_participants!inner (
            user_id,
            joined_at,
            last_read_at,
            profiles:user_id (
              id,
              email,
              full_name,
              avatar_url,
              user_type
            )
          )
        `)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }

      // Get last messages for each conversation
      const conversationIds = conversations?.map(c => c.id) || [];
      const { data: lastMessages } = await this.supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          content,
          created_at,
          profiles:sender_id (
            id,
            email,
            full_name,
            avatar_url,
            user_type
          )
        `)
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      // Get unread counts
      const { data: unreadCounts } = await this.supabase
        .from('unread_messages_count')
        .select('conversation_id, unread_count')
        .eq('user_id', user.id);

      // Combine the data
      const conversationsWithDetails = conversations?.map(conv => {
        const lastMessage = lastMessages?.find(m => m.conversation_id === conv.id);
        const unreadCount = unreadCounts?.find(u => u.conversation_id === conv.id)?.unread_count || 0;
        
        return {
          ...conv,
          participants: conv.conversation_participants.map((cp: any) => ({
            user_id: cp.user_id,
            joined_at: cp.joined_at,
            last_read_at: cp.last_read_at,
            user: cp.profiles
          })),
          last_message: lastMessage ? {
            ...lastMessage,
            sender: lastMessage.profiles
          } : undefined,
          unread_count: unreadCount
        };
      }) || [];

      return conversationsWithDetails;
    } catch (error) {
      console.error('Error in getConversations:', error);
      return [];
    }
  }

  async getMessages(conversationId: string, limit = 50, before?: string): Promise<Message[]> {
    try {
      let query = this.supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          content,
          created_at,
          edited_at,
          is_deleted,
          profiles:sender_id (
            id,
            email,
            full_name,
            avatar_url,
            user_type
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (before) {
        query = query.lt('created_at', before);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      // Transform and reverse to get chronological order
      const messages = (data || []).map(msg => ({
        ...msg,
        sender: msg.profiles
      })).reverse();

      return messages;
    } catch (error) {
      console.error('Error in getMessages:', error);
      return [];
    }
  }

  async sendMessage(conversationId: string, content: string): Promise<Message | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await this.supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim()
        })
        .select(`
          id,
          conversation_id,
          sender_id,
          content,
          created_at,
          edited_at,
          is_deleted
        `)
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return null;
      }

      // Fetch sender details
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, user_type')
        .eq('id', user.id)
        .single();

      // Get conversation data
      const conversationData = await this.getConversation(conversationId);
      if (conversationData?.participants) {
        await this.markAsRead(conversationId, user.id);
      }

      // Send email notification to the recipient
      try {
        // Get recipient info
        const recipient = conversationData?.participants.find(p => p.user_id !== user.id);
        if (recipient && recipient.user_id) {
          // Get recipient profile
          const { data: recipientProfile } = await this.supabase
            .from('profiles')
            .select('email, name, email_preferences')
            .eq('id', recipient.user_id)
            .single();

          // Check email preferences
          if (recipientProfile && recipientProfile.email_preferences?.new_messages !== false) {
            const conversationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/messages?conversation=${conversationId}`;
            
            await fetch('/api/email/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'new-message',
                data: {
                  recipientEmail: recipientProfile.email,
                  recipientName: recipientProfile.name || 'User',
                  senderName: user.name || 'User',
                  messagePreview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
                  conversationUrl,
                },
              }),
            });
          }
        }
      } catch (error) {
        console.error('Error sending message notification:', error);
        // Don't fail message send if email fails
      }

      return {
        ...data,
        sender: profile
      };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return null;
    }
  }

  async markAsRead(conversationId: string): Promise<boolean> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return false;

      const { error } = await this.supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  }

  // Subscribe to new messages in a conversation
  subscribeToMessages(
    conversationId: string,
    onMessage: (message: Message) => void
  ) {
    const channel = this.supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          // Fetch full message details with sender info
          const { data } = await this.supabase
            .from('messages')
            .select(`
              id,
              conversation_id,
              sender_id,
              content,
              created_at,
              edited_at,
              is_deleted,
              profiles:sender_id (
                id,
                email,
                full_name,
                avatar_url,
                user_type
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            onMessage({
              ...data,
              sender: data.profiles
            });
          }
        }
      )
      .subscribe();

    return () => {
      this.supabase.removeChannel(channel);
    };
  }

  // Subscribe to conversation updates (for unread counts)
  subscribeToConversations(
    userId: string,
    onUpdate: (conversation: Partial<Conversation>) => void
  ) {
    const channel = this.supabase
      .channel(`conversations:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          onUpdate(payload.new as Partial<Conversation>);
        }
      )
      .subscribe();

    return () => {
      this.supabase.removeChannel(channel);
    };
  }
}

export const messagingService = new MessagingService(); 