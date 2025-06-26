# Error Fixing Checklist 🛠️

## Understanding the Issues

### Issue 1: Missing metadataBase
- [ ] **Understand**: What is `metadataBase` and why does Next.js need it?
- [ ] **Research**: How do Open Graph and Twitter cards work?
- [ ] **Learn**: What happens when social media platforms scrape your site?

### Issue 2: Redux-persist storage warning
- [ ] **Understand**: What is Server-Side Rendering (SSR) vs Client-Side Rendering (CSR)?
- [ ] **Learn**: Why isn't `localStorage` available during SSR?
- [ ] **Explore**: What is hydration in React/Next.js?

## Implementation Steps

### Fix 1: Add metadataBase
- [ ] Add `metadataBase` to metadata configuration
- [ ] Use environment variables for different environments (dev, prod)
- [ ] Test social media preview functionality

### Fix 2: Handle Redux-persist gracefully
- [ ] Create a client-side only storage configuration
- [ ] Add proper fallback for SSR
- [ ] Understand the trade-offs of this approach

## Verification Steps
- [ ] Run the app and verify warnings are gone
- [ ] Test that redux-persist works correctly in browser
- [ ] Test social media sharing (optional)

## Deep Dive Questions
- [ ] How would you handle different metadataBase URLs for staging vs production?
- [ ] What are the security implications of persisting auth data in localStorage?
- [ ] How could you implement a more robust storage fallback strategy? 