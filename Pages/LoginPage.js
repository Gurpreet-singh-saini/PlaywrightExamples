
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.useremail = page.locator("//input[@id='userName']");
    this.passwordInput = page.locator("//input[@id='password']");
    this.signInButton = page.locator("//button[normalize-space()='Sign In']");
  }

  async goto() {
    await this.page.goto('https://uat.blockridge.com/');
  }

  async loginToApplication(username, password) {
    await this.useremail.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }


  async fillUsername(useremail) {
    await this.useremail.fill(useremail);
  }

  async fillPassword(passwordInput) {
    await this.passwordInput.fill(passwordInput);
  }

  async Encryptlogin(useremail, passwordInput) {
    await this.fillUsername(useremail);
    await this.fillPassword(passwordInput);
    await this.signInButton.click();
  }

}


