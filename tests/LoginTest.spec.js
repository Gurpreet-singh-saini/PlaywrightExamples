import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage.js';
import loginData from '../TestData/LoginData.json' assert { type: 'json' };
import logger from '../utils/LoggerUtil.js';
import { log } from 'console';
import { decrypt } from '../utils/CryptojsUtil.js';
import { encryptEnvFile } from '../utils/EncryptEnvFile.js';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configDir = path.resolve(__dirname, "..", "config");

dotenv.config({ path: path.resolve(configDir, ".env") });

let loginPage;

test.describe('Login Tests - Data Driven', () => {

  // Runs before each test
  test.beforeEach('open URL and create object', async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    logger.info('Navigated to the application URL');
  });

  // Runs after each test
  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    logger.info('Cleared cookies and local storage after test');
  });

  /*
  // ❗ IMPORTANT: forEach MUST be inside describe but OUTSIDE beforeEach/afterEach
  loginData.forEach(user => {
  
    test(`Login test - ${user.username}`, async ({ page }) => {
  
      try {
        await loginPage.loginToApplication(user.username, user.password);
  
        // Assertion #1 — Success toast/message
        const successToastMessage = page.locator("text=User Logged in Successfully");
        await expect(successToastMessage).toBeVisible({ timeout: 5000 });
        logger.info(`Login successful for user: ${user.username}`);
        logger.info('Success message verified on login ' + successToastMessage);
  
        // Assertion #2 — URL
        await expect(page).toHaveURL("https://uat.blockridge.com/auth/dashboard");
  
      } catch (error) {
        logger.error(`Login test failed for user ${user.username}: ${error.message}`);
        throw error;
      }
  
    });
  });
  */

  test("simple login test", async ({ page }) => {
    logger.info("Starting test for login");
    
    // Get encrypted credentials from environment variables
    let username = process.env.LOGIN_EMAIL;
    let password = process.env.LOGIN_PASSWORD;
    
    logger.info("Credentials loaded from .env (encrypted)");
    
    // Decrypt the credentials if they are encrypted
    if (username && username.startsWith("U2FsdGVkX1")) {
      username = decrypt(username);
      logger.info("Email decrypted ✓");
    }
    
    if (password && password.startsWith("U2FsdGVkX1")) {
      password = decrypt(password);
      logger.info("Password decrypted ✓");
    }
    
    logger.info(`Using email: ${username}`);
    logger.info(`Using password: ${password.substring(0, 3)}***`);
    
    await loginPage.fillUsername(username);
    logger.info("Username filled in form");
    
    await loginPage.fillPassword(password);
    logger.info("Password filled in form");
    
    await loginPage.signInButton.click();
    logger.info("Clicked Sign In button");
    logger.info("Page loaded after login");
    
    const successToastMessage = page.locator("text=User Logged in Successfully");
    await expect(successToastMessage).toBeVisible({ timeout: 5000 });
    logger.info(`Login successful for user: ${username}`);
    logger.info('Success message verified on login');

    logger.info("Test for login is completed");
  });

});


