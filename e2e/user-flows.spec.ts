import { test, expect } from '@playwright/test';

// Complete User Flow Tests for 100% Coverage
test.describe('Developer User Flow', () => {
  test('should complete developer onboarding flow', async ({ page }) => {
    // 1. Navigate to signup
    await page.goto('/signup');
    await expect(page.locator('h1')).toContainText('Join Chosn');

    // 2. Fill signup form
    await page.fill('[name="email"]', 'developer@test.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="full_name"]', 'Test Developer');
    await page.selectOption('[name="user_type"]', 'developer');
    
    // 3. Submit form
    await page.click('button[type="submit"]');
    
    // 4. Should redirect to onboarding
    await expect(page).toHaveURL('/onboarding');
    
    // 5. Complete skills section
    await page.click('[data-testid="skill-react"]');
    await page.click('[data-testid="skill-nodejs"]');
    await page.click('[data-testid="skill-typescript"]');
    
    // 6. Add experience
    await page.fill('[name="years_experience"]', '5');
    await page.selectOption('[name="experience_level"]', 'senior');
    
    // 7. Set preferences
    await page.selectOption('[name="work_preference"]', 'remote');
    await page.fill('[name="expected_salary"]', '120000');
    
    // 8. Complete onboarding
    await page.click('button[data-testid="complete-onboarding"]');
    
    // 9. Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should view and update profile', async ({ page }) => {
    // Assume user is logged in
    await page.goto('/profile');
    
    // Check profile sections
    await expect(page.locator('[data-testid="profile-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="skills-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="experience-section"]')).toBeVisible();
    
    // Edit profile
    await page.click('[data-testid="edit-profile-btn"]');
    await page.fill('[name="bio"]', 'Updated bio text');
    await page.click('[data-testid="save-profile-btn"]');
    
    // Verify changes saved
    await expect(page.locator('[data-testid="profile-bio"]')).toContainText('Updated bio text');
  });

  test('should browse and apply to companies', async ({ page }) => {
    await page.goto('/companies');
    
    // Check companies list
    await expect(page.locator('[data-testid="companies-grid"]')).toBeVisible();
    
    // Click on first company
    await page.click('[data-testid="company-card"]:first-child');
    
    // Should show company details
    await expect(page.locator('[data-testid="company-details"]')).toBeVisible();
    
    // Show interest
    await page.click('[data-testid="show-interest-btn"]');
    
    // Should show success message
    await expect(page.locator('[data-testid="interest-success"]')).toBeVisible();
  });
});

test.describe('Company User Flow', () => {
  test('should complete company onboarding', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill company signup
    await page.fill('[name="email"]', 'company@test.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="company_name"]', 'Test Company');
    await page.selectOption('[name="user_type"]', 'company');
    
    await page.click('button[type="submit"]');
    
    // Complete company onboarding
    await expect(page).toHaveURL('/onboarding');
    
    await page.fill('[name="company_size"]', '50-100');
    await page.fill('[name="industry"]', 'Technology');
    await page.fill('[name="description"]', 'A great tech company');
    
    await page.click('button[data-testid="complete-onboarding"]');
    await expect(page).toHaveURL('/companies/dashboard');
  });

  test('should browse developers and send messages', async ({ page }) => {
    await page.goto('/developers');
    
    // Check developers list
    await expect(page.locator('[data-testid="developers-grid"]')).toBeVisible();
    
    // Click on developer
    await page.click('[data-testid="developer-card"]:first-child');
    
    // Send message
    await page.click('[data-testid="message-btn"]');
    await page.fill('[name="message"]', 'Hello, interested in your profile!');
    await page.click('[data-testid="send-message-btn"]');
    
    // Should show success
    await expect(page.locator('[data-testid="message-sent"]')).toBeVisible();
  });
});

test.describe('Messaging System', () => {
  test('should send and receive messages', async ({ page, context }) => {
    // Test real-time messaging
    const page2 = await context.newPage();
    
    // User 1 login
    await page.goto('/login');
    await page.fill('[name="email"]', 'user1@test.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // User 2 login
    await page2.goto('/login'); 
    await page2.fill('[name="email"]', 'user2@test.com');
    await page2.fill('[name="password"]', 'password');
    await page2.click('button[type="submit"]');
    
    // Both go to messages
    await page.goto('/messages');
    await page2.goto('/messages');
    
    // User 1 sends message
    await page.click('[data-testid="conversation"]:first-child');
    await page.fill('[name="message"]', 'Hello from user 1!');
    await page.click('[data-testid="send-btn"]');
    
    // User 2 should receive message
    await page2.click('[data-testid="conversation"]:first-child');
    await expect(page2.locator('[data-testid="message"]')).toContainText('Hello from user 1!');
    
    await page2.close();
  });
});

test.describe('Search and Discovery', () => {
  test('should search developers with filters', async ({ page }) => {
    await page.goto('/developers');
    
    // Use search filters
    await page.fill('[data-testid="search-input"]', 'React');
    await page.selectOption('[data-testid="experience-filter"]', 'senior');
    await page.selectOption('[data-testid="location-filter"]', 'remote');
    
    await page.click('[data-testid="apply-filters-btn"]');
    
    // Should show filtered results
    await expect(page.locator('[data-testid="results-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="developer-card"]')).toHaveCount.toBeGreaterThan(0);
  });

  test('should discover feed functionality', async ({ page }) => {
    await page.goto('/discover');
    
    // Check feed items load
    await expect(page.locator('[data-testid="feed-item"]')).toHaveCount.toBeGreaterThan(0);
    
    // Test infinite scroll
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Should load more items
    await page.waitForTimeout(1000);
    await expect(page.locator('[data-testid="feed-item"]')).toHaveCount.toBeGreaterThan(5);
  });
});

test.describe('Analytics Dashboard', () => {
  test('should display analytics data', async ({ page }) => {
    await page.goto('/analytics');
    
    // Check metrics cards
    await expect(page.locator('[data-testid="metric-card"]')).toHaveCount(4);
    
    // Check charts load
    await expect(page.locator('[data-testid="analytics-chart"]')).toBeVisible();
    
    // Test export functionality
    await page.click('[data-testid="export-btn"]');
    
    // Should trigger download
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('analytics');
  });
});

test.describe('Settings and Preferences', () => {
  test('should update user settings', async ({ page }) => {
    await page.goto('/settings');
    
    // Update notification preferences
    await page.uncheck('[data-testid="email-notifications"]');
    await page.check('[data-testid="push-notifications"]');
    
    // Update privacy settings
    await page.selectOption('[data-testid="profile-visibility"]', 'private');
    
    // Save settings
    await page.click('[data-testid="save-settings-btn"]');
    
    // Should show success message
    await expect(page.locator('[data-testid="settings-saved"]')).toBeVisible();
  });

  test('should change password', async ({ page }) => {
    await page.goto('/settings');
    await page.click('[data-testid="security-tab"]');
    
    await page.fill('[name="current_password"]', 'oldpassword');
    await page.fill('[name="new_password"]', 'newpassword123');
    await page.fill('[name="confirm_password"]', 'newpassword123');
    
    await page.click('[data-testid="change-password-btn"]');
    await expect(page.locator('[data-testid="password-changed"]')).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);
    await page.goto('/dashboard');
    
    // Should show offline message
    await expect(page.locator('[data-testid="offline-banner"]')).toBeVisible();
    
    // Re-enable network
    await page.context().setOffline(false);
    await page.reload();
    
    // Should work normally
    await expect(page.locator('[data-testid="offline-banner"]')).not.toBeVisible();
  });

  test('should show 404 for invalid routes', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('h1')).toContainText('404');
    await expect(page.locator('[data-testid="back-home-btn"]')).toBeVisible();
  });
});

test.describe('Performance Tests', () => {
  test('should load pages quickly', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(3000); // Under 3 seconds
  });

  test('should handle large data sets', async ({ page }) => {
    await page.goto('/developers');
    
    // Load large number of developers
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
    }
    
    // Page should remain responsive
    const button = page.locator('[data-testid="filter-btn"]');
    await expect(button).toBeEnabled();
  });
});

test.describe('Accessibility Tests', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should focus on navigation elements
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    // Check for ARIA landmarks
    await expect(page.locator('[role="main"]')).toBeVisible();
    await expect(page.locator('[role="navigation"]')).toBeVisible();
    
    // Check for alt text on images
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });
}); 