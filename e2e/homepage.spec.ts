import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the homepage successfully', async ({ page }) => {
    // Check that the page loads
    await expect(page).toHaveTitle(/Chosn/)
    
    // Check for main heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should display navigation correctly', async ({ page }) => {
    // Check navigation elements
    await expect(page.getByRole('navigation')).toBeVisible()
    
    // Check for login/signup links
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
  })

  test('should have working CTA buttons', async ({ page }) => {
    // Find and click main CTA button
    const ctaButton = page.getByRole('button', { name: /get started/i }).first()
    await expect(ctaButton).toBeVisible()
    await ctaButton.click()
    
    // Should navigate to signup or relevant page
    await expect(page).toHaveURL(/signup|login|onboarding/)
  })

  test('should display features section', async ({ page }) => {
    // Scroll to features section
    await page.getByText(/features/i).first().scrollIntoViewIfNeeded()
    
    // Check that features are visible
    await expect(page.getByText(/github integration/i)).toBeVisible()
    await expect(page.getByText(/skill verification/i)).toBeVisible()
  })

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that navigation adapts to mobile
    await expect(page.getByRole('navigation')).toBeVisible()
    
    // Check that main content is still accessible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should have proper SEO elements', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /developer talent/i)
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveCount(1)
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /Chosn/i)
  })

  test('should have no accessibility violations', async ({ page }) => {
    // Basic accessibility checks
    await expect(page.getByRole('main')).toBeVisible()
    
    // Check for proper heading hierarchy
    const h1Count = await page.getByRole('heading', { level: 1 }).count()
    expect(h1Count).toBe(1)
    
    // Check that interactive elements are focusable
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()
  })
}) 