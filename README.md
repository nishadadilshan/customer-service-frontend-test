# Customer Service Frontend Tests

This project contains Playwright tests for the customer service frontend application running on `http://localhost:3000/`.

## Prerequisites

- Node.js (version 18 or higher)
- Your customer service application running on `http://localhost:3000/`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npm run test:install
```

## Running Tests

### Run all tests (headless)
```bash
npm test
```

### Run tests with browser UI visible
```bash
npm run test:headed
```

### Run tests with Playwright UI mode
```bash
npm run test:ui
```

### Debug tests
```bash
npm run test:debug
```

### View test report
```bash
npm run test:report
```

## Test Structure

- `tests/example.spec.ts` - Basic tests for homepage loading, responsiveness, and navigation
- `tests/customer-service.spec.ts` - Specific tests for customer service functionality

## Test Features

The test suite includes:

- **Homepage Loading**: Verifies the application loads correctly
- **Responsive Design**: Tests different viewport sizes (desktop, tablet, mobile)
- **Navigation**: Tests link navigation and page structure
- **Form Interactions**: Tests form filling and submission
- **Button Clicks**: Tests interactive elements
- **Accessibility**: Checks for alt text, heading hierarchy, and keyboard navigation
- **API Handling**: Monitors network requests and responses
- **Error Checking**: Verifies no console or network errors
- **Screenshots**: Captures screenshots for visual verification

## Configuration

- `playwright.config.ts` - Main Playwright configuration
- `tsconfig.json` - TypeScript configuration
- Tests run against `http://localhost:3000/` by default

## Screenshots

Test screenshots are saved in `tests/screenshots/` directory for visual verification.

## Browser Support

Tests run on:
- Chromium
- Firefox
- WebKit (Safari)

## Troubleshooting

1. **Application not running**: Make sure your customer service application is running on `http://localhost:3000/`
2. **Browser installation issues**: Run `npm run test:install` to reinstall browsers
3. **Test failures**: Check the test report with `npm run test:report` for detailed information

## run single test class

npx playwright test tests/customer-service-test.spec.ts
npx playwright test tests/customer-service-test.spec.ts --headed

## to open the recorder
npx playwright codegen tests/customer-service-test.spec.ts