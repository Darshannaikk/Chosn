# Activity Tracking Implementation Guide

## Overview

We've implemented a comprehensive activity tracking system that powers three major features:
1. **Developer Social Cards** - Shareable achievement cards
2. **Company Activity Feed** - Real-time developer updates
3. **Developer Timeline** - Personal activity dashboard

## Database Schema

### Core Tables

1. **developer_activities**
   - Stores all developer activities
   - Types: github_commit, skill_added, profile_update, etc.
   - Supports public/private visibility

2. **profile_views**
   - Tracks who viewed which profiles
   - Prevents duplicate views within same hour
   - Creates activities for viewed developers

3. **social_card_shares**
   - Analytics for social card sharing
   - Tracks platform, conversions, referrers
   - Measures viral growth

4. **developer_timeline_settings**
   - Privacy controls for timelines
   - Granular activity type visibility

5. **github_activity_cache**
   - Performance optimization
   - Stores GitHub commits locally

## Key Features Implemented

### 1. Activity Tracking Service
```typescript
// Track profile views automatically
await activityTrackingService.trackProfileView(developerId);

// Create custom activities
await activityTrackingService.createActivity(
  'achievement_earned',
  'Earned AWS Certification',
  'Completed AWS Solutions Architect certification',
  { certification: 'AWS SA', level: 'Professional' }
);

// Track social shares
await activityTrackingService.trackSocialCardShare('twitter');
```

### 2. Real-time Activity Feed
- Companies see live developer activities
- Filterable by activity type
- Rich metadata display
- Quick actions to view/contact

### 3. Developer Timeline
- Personal activity history
- Privacy toggle (public/private)
- Statistics dashboard
- Export capabilities

### 4. Social Card Analytics
- Track shares across platforms
- Measure conversion rates
- Identify viral content

## Integration Points

### When Activities Are Created

1. **Automatic Triggers**:
   - New skill added → skill_added activity
   - GitHub push → github_commit activity
   - Profile view → profile_view_received activity
   - Message received → message_received activity

2. **Manual Triggers**:
   - Profile updates
   - Availability changes
   - Achievement unlocks

### GitHub Integration

To connect GitHub activities:

```typescript
// In your GitHub webhook handler
const activities = webhookData.commits.map(commit => ({
  type: 'github_commit',
  repo: webhookData.repository.name,
  message: commit.message,
  sha: commit.id,
  language: webhookData.repository.language,
  additions: commit.added.length,
  deletions: commit.removed.length,
  date: commit.timestamp
}));

await activityTrackingService.cacheGitHubActivity(activities);
```

## Privacy & Security

### Row Level Security
- Developers see only their activities
- Public activities visible to authenticated users
- Companies see their viewing history
- Timeline settings are user-specific

### Privacy Controls
```sql
-- Users control timeline visibility
UPDATE developer_timeline_settings 
SET is_public = true,
    show_profile_views = false
WHERE developer_id = auth.uid();
```

## Performance Optimizations

### Indexes
- developer_id for fast user queries
- created_at DESC for chronological ordering
- activity_type for filtering
- Composite indexes for complex queries

### Caching Strategy
- GitHub activities cached locally
- Profile views deduplicated hourly
- Activity feed uses materialized function

## API Endpoints

### Activity Feed
```typescript
// GET /api/activities/feed?filter=github_commit&limit=50
const activities = await activityTrackingService.getActivityFeed(
  filter,
  limit,
  offset
);
```

### Developer Timeline
```typescript
// GET /api/activities/timeline/:developerId
const timeline = await activityTrackingService.getDeveloperTimeline(
  developerId
);
```

### Analytics
```typescript
// GET /api/analytics/social-cards
const analytics = await activityTrackingService.getSocialCardAnalytics();
```

## Monitoring & Analytics

### Key Metrics to Track

1. **Activity Volume**
   ```sql
   SELECT 
     activity_type,
     COUNT(*) as count,
     DATE_TRUNC('day', created_at) as day
   FROM developer_activities
   GROUP BY activity_type, day
   ORDER BY day DESC;
   ```

2. **Social Card Performance**
   ```sql
   SELECT 
     platform,
     COUNT(*) as shares,
     SUM(CASE WHEN resulted_in_signup THEN 1 ELSE 0 END) as conversions
   FROM social_card_shares
   GROUP BY platform;
   ```

3. **Profile View Trends**
   ```sql
   SELECT 
     viewed_id,
     COUNT(DISTINCT viewer_id) as unique_viewers,
     COUNT(*) as total_views
   FROM profile_views
   WHERE viewed_at > NOW() - INTERVAL '7 days'
   GROUP BY viewed_id
   ORDER BY unique_viewers DESC;
   ```

## Future Enhancements

1. **Real-time Subscriptions**
   ```typescript
   // Subscribe to developer activities
   const subscription = supabase
     .from('developer_activities')
     .on('INSERT', payload => {
       // Update UI in real-time
     })
     .subscribe();
   ```

2. **AI-Powered Insights**
   - Predict developer availability
   - Suggest optimal contact times
   - Identify trending skills

3. **Advanced Analytics**
   - Cohort analysis
   - Funnel tracking
   - A/B testing social cards

## Troubleshooting

### Common Issues

1. **Activities not appearing**
   - Check RLS policies
   - Verify user authentication
   - Ensure activity type is valid

2. **Performance issues**
   - Add missing indexes
   - Limit feed queries
   - Use pagination

3. **Privacy concerns**
   - Review timeline settings
   - Check activity visibility
   - Audit access logs

## Testing

### Unit Tests
```typescript
describe('ActivityTrackingService', () => {
  it('should track profile views', async () => {
    await activityTrackingService.trackProfileView('user-id');
    // Verify view was recorded
  });
  
  it('should respect privacy settings', async () => {
    // Test private timeline access
  });
});
```

### Integration Tests
- Test activity creation flows
- Verify feed filtering
- Check analytics accuracy

## Deployment Checklist

- [ ] Run database migrations
- [ ] Set up indexes
- [ ] Configure RLS policies
- [ ] Test activity creation
- [ ] Verify feed performance
- [ ] Check privacy controls
- [ ] Monitor initial usage

## Success Metrics

1. **Engagement**
   - Daily active users on feed
   - Timeline views per developer
   - Social card shares per week

2. **Growth**
   - New signups from social cards
   - Viral coefficient
   - Profile discovery rate

3. **Quality**
   - Activity relevance scores
   - User feedback ratings
   - False positive rate

This system creates a powerful engagement loop that benefits both developers and companies while driving organic growth through social sharing. 