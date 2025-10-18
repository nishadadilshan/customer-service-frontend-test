import { test, expect } from '@playwright/test';

// Function to generate random test data
function generateTestData() {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const address = `${Math.floor(Math.random() * 9999) + 1} ${cities[Math.floor(Math.random() * cities.length)]} Street, ${cities[Math.floor(Math.random() * cities.length)]}`;
  
  return { fullName, email, address };
}

test.describe('Customer Service Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('create a new user', async ({ page }) => {
    // Generate dynamic test data
    const testData = generateTestData();
    console.log('Generated test data:', testData);
    
    // Check for common customer service elements
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Add Customer' }).click();
    await page.getByRole('textbox', { name: 'Full Name *' }).click();
    await page.getByRole('textbox', { name: 'Full Name *' }).fill(testData.fullName);
    await page.getByRole('textbox', { name: 'Email Address *' }).click();
    await page.getByRole('textbox', { name: 'Email Address *' }).fill(testData.email);
    await page.getByRole('textbox', { name: 'Address', exact: true }).click();
    await page.getByRole('textbox', { name: 'Address', exact: true }).fill(testData.address);
    // await page.getByRole('button', { name: 'Active' }).click();
    // await page.getByRole('button', { name: 'Inactive' }).click();
    await page.getByRole('button', { name: 'Create Customer' }).click();
    await expect(page.getByRole('heading', { name: testData.fullName, exact: true })).toBeVisible();
    await page.getByText('Active').nth(3).click();
    await page.getByText(testData.email).click();


    await page.waitForTimeout(5000);

    
  });

});