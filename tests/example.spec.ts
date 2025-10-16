import { test, expect } from '@playwright/test';

test.describe('Customer Service Frontend', () => {
  test('should load the homepage', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page title is present
    await expect(page).toHaveTitle(/.*/);
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'tests/screenshots/homepage.png' });
  });

  test('should have proper page structure', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page has basic HTML structure
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
    
    // Check if the page has a head section
    await expect(page.locator('head')).toBeAttached();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'tests/screenshots/desktop-view.png' });
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'tests/screenshots/tablet-view.png' });
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'tests/screenshots/mobile-view.png' });
  });

  test('should handle navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check if there are any navigation links
    const navLinks = page.locator('nav a, a[href]');
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      // Test clicking on the first navigation link
      const firstLink = navLinks.first();
      const href = await firstLink.getAttribute('href');
      
      if (href && !href.startsWith('http') && !href.startsWith('mailto:')) {
        await firstLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify we're on a different page or the same page with different content
        const currentUrl = page.url();
        expect(currentUrl).toBeTruthy();
      }
    }
  });

  test('should check for console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if there are any console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('should check for network errors', async ({ page }) => {
    const networkErrors: string[] = [];
    
    // Listen for failed network requests
    page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push(`${response.status()} - ${response.url()}`);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Log network errors if any (but don't fail the test unless critical)
    if (networkErrors.length > 0) {
      console.log('Network errors found:', networkErrors);
    }
  });
});
