'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks/use-app-dispatch';
import { useAppSelector } from '@/lib/hooks/use-app-selector';
import { messagingService } from '@/lib/api/messaging';
import {
  setConversations,
  setActiveConversation,
  setMessages,
  addMessage,
  setSending,
  setLoading
} from '@/lib/store/slices/messaging-slice';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, MessageSquare } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);
  const {
    conversations,
    activeConversation,
    messages,
    sending,
    loading,
    unreadCounts
  } = useAppSelector((state) => state.messaging);
  
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageSubscription = useRef<(() => void) | null>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Handle conversation query parameter
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      // Check if this conversation exists in our list
      const conversationExists = conversations.some(c => c.id === conversationId);
      if (conversationExists) {
        dispatch(setActiveConversation(conversationId));
      }
    }
  }, [searchParams, conversations, dispatch]);

  // Subscribe to messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      // Clean up previous subscription
      if (messageSubscription.current) {
        messageSubscription.current();
      }

      // Load messages for conversation
      loadMessages(activeConversation);

      // Mark as read
      messagingService.markAsRead(activeConversation);

      // Subscribe to new messages
      messageSubscription.current = messagingService.subscribeToMessages(
        activeConversation,
        (message) => {
          dispatch(addMessage({ conversationId: activeConversation, message }));
          // Mark as read if we're viewing this conversation
          messagingService.markAsRead(activeConversation);
        }
      );
    }

    return () => {
      if (messageSubscription.current) {
        messageSubscription.current();
      }
    };
  }, [activeConversation, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages[activeConversation || '']]);

  const loadConversations = async () => {
    dispatch(setLoading(true));
    const convs = await messagingService.getConversations();
    dispatch(setConversations(convs));
    dispatch(setLoading(false));
  };

  const loadMessages = async (conversationId: string) => {
    const msgs = await messagingService.getMessages(conversationId);
    dispatch(setMessages({ conversationId, messages: msgs }));
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation || sending) return;

    dispatch(setSending(true));
    const message = await messagingService.sendMessage(activeConversation, messageText);
    
    if (message) {
      setMessageText('');
      // Message will be added through the subscription
    }
    
    dispatch(setSending(false));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherParticipant = (conversation: any) => {
    return conversation.participants?.find((p: any) => p.user_id !== user?.id)?.user;
  };

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return format(messageDate, 'HH:mm');
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return format(messageDate, 'MMM d');
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Conversations List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        
        <ScrollArea className="flex-1">
          {loading && conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm mt-1">Start a conversation from a profile</p>
            </div>
          ) : (
            conversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              const unreadCount = unreadCounts[conversation.id] || 0;
              const isActive = activeConversation === conversation.id;

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer hover:bg-accent transition-colors",
                    isActive && "bg-accent"
                  )}
                  onClick={() => dispatch(setActiveConversation(conversation.id))}
                >
                  <Avatar>
                    <AvatarImage src={otherUser?.avatar_url} />
                    <AvatarFallback>
                      {otherUser?.full_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">
                        {otherUser?.full_name || 'Unknown User'}
                      </p>
                      {conversation.last_message && (
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(conversation.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    {conversation.last_message && (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message.sender_id === user?.id && 'You: '}
                        {conversation.last_message.content}
                      </p>
                    )}
                  </div>
                  
                  {unreadCount > 0 && (
                    <Badge variant="default" className="rounded-full">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              );
            })
          )}
        </ScrollArea>
      </div>

      {/* Messages View */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              {(() => {
                const activeConv = conversations.find(c => c.id === activeConversation);
                const otherUser = activeConv ? getOtherParticipant(activeConv) : null;
                
                return (
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={otherUser?.avatar_url} />
                      <AvatarFallback>
                        {otherUser?.full_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{otherUser?.full_name || 'Unknown User'}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {otherUser?.user_type || 'user'}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages[activeConversation]?.map((message) => {
                  const isOwn = message.sender_id === user?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        isOwn && "flex-row-reverse"
                      )}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={message.sender?.avatar_url} />
                        <AvatarFallback>
                          {message.sender?.full_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={cn(
                        "flex flex-col gap-1 max-w-[70%]",
                        isOwn && "items-end"
                      )}>
                        <div className={cn(
                          "rounded-lg px-3 py-2",
                          isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.created_at), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending}
                  className="flex-1"
                />
                <Button type="submit" disabled={sending || !messageText.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 