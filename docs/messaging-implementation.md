# Messaging System Implementation

## Overview
The Chosn messaging system enables real-time communication between developers and companies after they've shown mutual interest. Built on Supabase with PostgreSQL and real-time subscriptions.

## Key Features
- **1-to-1 Conversations**: Direct messaging between developers and companies
- **Real-time Updates**: Messages appear instantly using Supabase Realtime
- **Read Receipts**: Track read/unread status for messages
- **Message History**: Persistent storage with pagination support
- **Security**: Row-level security ensures users can only access their conversations

## Database Schema

### Tables
1. **conversations**: Stores conversation metadata
   - `id`: UUID primary key
   - `created_at`, `updated_at`, `last_message_at`: Timestamps

2. **conversation_participants**: Junction table for participants
   - Links users to conversations
   - Tracks `last_read_at` for unread counts

3. **messages**: Stores individual messages
   - `content`: Message text (max 5000 chars)
   - `sender_id`: Reference to auth.users
   - `is_deleted`: Soft delete support

### Key Functions
- `get_or_create_conversation()`: Creates or retrieves existing conversation
- `update_conversation_timestamp()`: Trigger to update conversation timestamps

## Frontend Architecture

### Redux State Management
- **messaging-slice.ts**: Manages conversations, messages, and UI state
- Handles optimistic updates and real-time sync
- Tracks unread counts per conversation

### Components
- **Messages Page** (`/app/messages/page.tsx`)
  - Split view: conversation list + active chat
  - Real-time message updates
  - Smooth scrolling and loading states

### API Service
- **messaging.ts**: Centralized API service
  - CRUD operations for messages/conversations
  - Real-time subscription management
  - Type-safe interfaces

## Real-time Features

### Supabase Realtime
```typescript
// Subscribe to new messages
messagingService.subscribeToMessages(conversationId, (message) => {
  // Handle new message
});
```

### WebSocket Connection
- Automatic reconnection handling
- Message delivery guarantees
- Presence tracking (future enhancement)

## Security Implementation

### Row Level Security (RLS)
- Users can only view their own conversations
- Messages restricted to conversation participants
- Secure message sending validation

### Input Validation
- Message length limits (5000 chars)
- Content sanitization
- Rate limiting (to be implemented)

## Integration Points

### Company Dashboard
- "Send Message" button on developer cards
- Creates conversation and redirects to messages

### Developer Profiles
- Message button for direct contact
- Only visible to subscribed companies

## Performance Optimizations

### Database
- Indexes on frequently queried columns
- Efficient pagination for message history
- Optimized queries with proper joins

### Frontend
- Message caching in Redux
- Lazy loading of older messages
- Debounced typing indicators (future)

## Future Enhancements

### V1.5 Features
- [ ] File attachments
- [ ] Typing indicators
- [ ] Message search
- [ ] Email notifications
- [ ] Mobile app support

### V2.0 Features
- [ ] Group conversations
- [ ] Voice/video calls
- [ ] Message reactions
- [ ] Thread replies
- [ ] Advanced moderation tools

## Testing Checklist

### Manual Testing
1. Create conversation between two users
2. Send messages in both directions
3. Verify real-time delivery
4. Check unread counts update
5. Test message persistence
6. Verify security (can't access others' messages)

### Automated Tests (TODO)
- Unit tests for Redux slices
- Integration tests for API endpoints
- E2E tests for messaging flow

## Deployment Notes

### Environment Variables
No additional environment variables needed - uses existing Supabase config.

### Database Migration
Run the migration file: `supabase/migrations/20250120_messaging_system.sql`

### Monitoring
- Track message delivery rates
- Monitor WebSocket connections
- Alert on high error rates

## Troubleshooting

### Common Issues
1. **Messages not appearing**: Check WebSocket connection
2. **Unread counts wrong**: Verify last_read_at updates
3. **Can't send messages**: Check RLS policies
4. **Performance issues**: Review database indexes

### Debug Commands
```sql
-- Check user's conversations
SELECT * FROM conversations c
JOIN conversation_participants cp ON c.id = cp.conversation_id
WHERE cp.user_id = 'USER_ID';

-- View unread counts
SELECT * FROM unread_messages_count WHERE user_id = 'USER_ID';
``` 