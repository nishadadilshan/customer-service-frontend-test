import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1000); // Wait for page to load

  // Generate fake data with valid name characters only
  const validNames = [
    'John Smith', 'Mary-Jane O\'Connor', 'José García', 'Anna Müller', 
    'Jean-Pierre Dubois', 'María José', 'O\'Brien-Smith', 'François',
    'Élise Martin', 'Hans-Peter', 'Catherine O\'Malley', 'André'
  ];
  const randomName = validNames[Math.floor(Math.random() * validNames.length)];
  
  const fakeData = {
    name: randomName,
    email: `testuser${Math.floor(Math.random() * 1000)}@example.com`,
    address: `Test Address ${Math.floor(Math.random() * 1000)}, City`
  };
  
  console.log('Generated fake data:', fakeData);

  // Add Customer
  await page.getByTestId('nav-add-customer').click();
  await page.waitForTimeout(500); // Wait for navigation
  
    //   await page.getByTestId('name-input').click();
  await page.getByTestId('name-input').fill(fakeData.name);
  await page.waitForTimeout(300); // Wait after filling name
  
//   await page.getByTestId('email-input').click();
  await page.getByTestId('email-input').fill(fakeData.email);
  await page.waitForTimeout(300); // Wait after filling email
  
//   await page.getByTestId('address-input').click();
  await page.getByTestId('address-input').fill(fakeData.address);
  await page.waitForTimeout(300); // Wait after filling address
  
  await page.getByTestId('status-toggle-button').click();
  await page.waitForTimeout(200); // Wait after first toggle
  await page.getByTestId('status-toggle-button').click();
  await page.waitForTimeout(500); // Wait after second toggle
  
  // Set up API response interception
  const responsePromise = page.waitForResponse(response => 
    response.url() === 'http://localhost:8081/api/customer' && response.request().method() === 'POST'
  );
  
  await page.getByTestId('submit-button').click();
  await page.waitForTimeout(1000); // Wait for form submission
  
  // Wait for API response and extract customerId
  const response = await responsePromise;
  const responseData = await response.json();
  const customerId = responseData.customerId;
  console.log(`Created customer with ID: ${customerId}`);

  // Generate updated fake data for editing with valid name characters
  const updatedValidNames = [
    'Updated Smith', 'New O\'Connor', 'Modified García', 'Changed Müller', 
    'Updated Dubois', 'New José', 'Modified O\'Brien', 'Updated François',
    'New Martin', 'Updated Hans-Peter', 'Modified O\'Malley', 'New André'
  ];
  const randomUpdatedName = updatedValidNames[Math.floor(Math.random() * updatedValidNames.length)];
  
  const updatedFakeData = {
    name: randomUpdatedName,
    address: `Updated Address ${Math.floor(Math.random() * 1000)}, New City`
  };
  
  console.log('Generated updated fake data:', updatedFakeData);

  // Verify Customer
  await page.waitForTimeout(1000); // Wait for customer list to update
  await expect(page.getByTestId(`customer-name-${customerId}`)).toBeVisible();
  await expect(page.getByTestId(`status-active-${customerId}`)).toBeVisible();
  await expect(page.getByText(fakeData.email)).toBeVisible();
  await expect(page.getByText(fakeData.address)).toBeVisible();
  await page.waitForTimeout(1000); // Wait to see verification results

  // Edit Customer
  await page.getByTestId(`edit-customer-btn-${customerId}`).click();
  await page.waitForTimeout(500); // Wait for edit form to load
  
  await page.getByTestId('name-input').click();
  await page.getByTestId('name-input').fill(updatedFakeData.name);
  await page.waitForTimeout(300); // Wait after updating name
  
  await page.getByTestId('address-input').click();
  await page.getByTestId('address-input').fill(updatedFakeData.address);
  await page.waitForTimeout(300); // Wait after updating address
  
  await page.getByTestId('submit-button').click();
  await page.waitForTimeout(1000); // Wait for update to complete
  
  await expect(page.getByTestId(`customer-name-${customerId}`)).toBeVisible();
  await expect(page.getByTestId(`status-active-${customerId}`)).toBeVisible();
  await expect(page.getByText(fakeData.email)).toBeVisible();
  await expect(page.getByText(updatedFakeData.address)).toBeVisible();
  await page.waitForTimeout(1000); // Wait to see update results
  
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByTestId(`delete-customer-btn-${customerId}`).click();
  await page.waitForTimeout(1000); // Wait to see deletion
});