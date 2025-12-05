import { test, expect } from '@playwright/test';

test('GET users', async ({ request }) => {
  // Using jsonplaceholder - more reliable for testing (no rate limits)
  const response = await request.get('https://jsonplaceholder.typicode.com/users');
  
  console.log('Status:', response.status());
  
  await expect(response.status()).toBe(200);
  
  const body = await response.json();
  console.log('Users count:', body.length);
  
  await expect(body.length).toBeGreaterThan(0);
  console.log('✅ API test passed!');
});