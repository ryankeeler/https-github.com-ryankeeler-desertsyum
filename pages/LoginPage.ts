import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
    private page: Page;
    username_textbox: Locator;
    password_textbox: Locator;
    login_button: Locator

    constructor(page: Page) {
        this.page = page;
    }

    private async initialize() {
        this.username_textbox = this.page.locator('[name="email"]')
        this.password_textbox = this.page.locator('[name="password"]')
        this.login_button = this.page.getByRole('button', { name: 'Login' })

    }

    static async getInstance(page) {
        const instance = new LoginPage(page);
        await instance.initialize();
        return instance;
    }

    async loginToProposify(username: string, password: string) {
         // Access the GitHub secrets passed in as environment variables
        const username = process.env.PROPOSIFY_USERNAME;
        const password = process.env.PROPOSIFY_PASSWORD;

        // Ensure the username and password are available
        if (!username || !password) {
            throw new Error('Username or password is missing.');
        }
        await expect(this.username_textbox).toBeVisible({timeout: 10000});
        await this.username_textbox.fill(username)
        await this.password_textbox.fill(password)

        await this.login_button.click();
    }
}
