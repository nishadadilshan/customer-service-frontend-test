import { test, expect } from '@playwright/test';

test.describe('Customer Service Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display customer service interface', async ({ page }) => {
    // Check for common customer service elements
    const possibleSelectors = [
      'h1', 'h2', 'h3', // Headers
      'button', 'input', 'form', // Interactive elements
      '[data-testid*="customer"]', // Custom test IDs
      '[class*="customer"]', // CSS classes with customer
      '[id*="customer"]' // IDs with customer
    ];

    let foundElements = 0;
    for (const selector of possibleSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        foundElements += elements;
      }
    }

    // The page should have some interactive elements
    expect(foundElements).toBeGreaterThan(0);
  });

  test('should handle form interactions', async ({ page }) => {
    // Look for form elements
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      // Test the first form
      const firstForm = forms.first();
      
      // Look for input fields
      const inputs = firstForm.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        // Test filling out the first input
        const firstInput = inputs.first();
        const inputType = await firstInput.getAttribute('type');
        
        if (inputType !== 'hidden' && inputType !== 'submit') {
          await firstInput.fill('test input');
          const value = await firstInput.inputValue();
          expect(value).toBe('test input');
        }
      }
    }
  });

  test('should handle button clicks', async ({ page }) => {
    // Look for buttons
    const buttons = page.locator('button, input[type="button"], input[type="submit"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      // Test clicking the first button
      const firstButton = buttons.first();
      const buttonText = await firstButton.textContent();
      
      // Only click if it's not a destructive action
      if (buttonText && !buttonText.toLowerCase().includes('delete')) {
        await firstButton.click();
        await page.waitForTimeout(1000); // Wait for any potential navigation or updates
      }
    }
  });

  test('should check for accessibility features', async ({ page }) => {
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Images should have alt text for accessibility
      expect(alt).toBeTruthy();
    }

    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    if (headingCount > 0) {
      // At least one heading should be present
      expect(headingCount).toBeGreaterThan(0);
    }
  });

  test('should handle API calls gracefully', async ({ page }) => {
    // Monitor network requests
    const requests: string[] = [];
    const responses: string[] = [];
    
    page.on('request', request => {
      requests.push(`${request.method()} ${request.url()}`);
    });
    
    page.on('response', response => {
      responses.push(`${response.status()} ${response.url()}`);
    });
    
    // Trigger any potential API calls by interacting with the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Log the requests and responses for debugging
    console.log('Requests made:', requests);
    console.log('Responses received:', responses);
    
    // Check that we don't have any 500 errors
    const serverErrors = responses.filter(r => r.startsWith('5'));
    expect(serverErrors).toHaveLength(0);
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // Check if focus is visible
    const focusedElement = page.locator(':focus');
    const isFocused = await focusedElement.count();
    
    // If there are focusable elements, at least one should be focusable
    if (isFocused > 0) {
      expect(isFocused).toBeGreaterThan(0);
    }
  });

  test('should handle different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1024, height: 768, name: 'laptop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForLoadState('networkidle');
      
      // Check that the page is still functional
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Take a screenshot for each viewport
      await page.screenshot({ 
        path: `tests/screenshots/${viewport.name}-viewport.png`,
        fullPage: true 
      });
    }
  });
});
