# Messaging System Implementation Checklist

## Database Schema
- [ ] Create `conversations` table
  - id, participant_ids[], created_at, updated_at, last_message_at
- [ ] Create `messages` table  
  - id, conversation_id, sender_id, content, created_at, read_at
- [ ] Add indexes for performance
  - conversation_id + created_at for message retrieval
  - sender_id for user's sent messages

## Backend API Endpoints
- [ ] POST `/api/conversations/create` - Start new conversation
- [ ] GET `/api/conversations` - List user's conversations
- [ ] GET `/api/conversations/:id/messages` - Get messages in conversation
- [ ] POST `/api/conversations/:id/messages` - Send message
- [ ] PATCH `/api/messages/:id/read` - Mark message as read

## Frontend Components
- [ ] Create `MessageList` component - Display conversation messages
- [ ] Create `MessageInput` component - Text input with send button
- [ ] Create `ConversationList` component - Show all conversations
- [ ] Create `MessageBubble` component - Individual message display
- [ ] Add unread message indicators

## Real-time Features (Supabase Realtime)
- [ ] Set up message subscription for active conversation
- [ ] Handle new message events
- [ ] Update UI without refresh
- [ ] Show typing indicators (optional for V1)

## State Management
- [ ] Add messages slice to Redux store
- [ ] Cache conversations locally
- [ ] Handle optimistic updates for sent messages
- [ ] Sync state with real-time updates

## Security & Validation
- [ ] Ensure users can only access their conversations
- [ ] Validate message content (length, sanitization)
- [ ] Implement rate limiting for message sending
- [ ] Check subscription status before allowing messages

## UI/UX Considerations
- [ ] Mobile-responsive message interface
- [ ] Smooth scrolling to latest messages
- [ ] Loading states for message history
- [ ] Error handling for failed sends
- [ ] Empty state for no conversations

## Testing Checklist
- [ ] Can create conversation between matched users
- [ ] Messages appear in real-time
- [ ] Unread counts update correctly
- [ ] Message history loads properly
- [ ] Security rules prevent unauthorized access

## Research Topics
- [ ] How does Supabase Realtime work?
- [ ] What are WebSocket connections?
- [ ] How to implement pagination for messages?
- [ ] Best practices for chat UI/UX? 