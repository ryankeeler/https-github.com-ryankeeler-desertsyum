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

 async loginToProposify() {
        let username: string;
        let password: string;

        // Check if we're running on GitHub Actions (CI environment)
        if (process.env.CI) {
            // Use GitHub secrets when running on CI (GitHub Actions)
            username = process.env.PROPOSIFY_USERNAME;
            password = process.env.PROPOSIFY_PASSWORD;

            if (!username || !password) {
                throw new Error('GitHub secrets (username or password) are missing.');
            }
        } else {
            // Use local credentials.json when not on CI (local environment)
            const credentialsPath = path.join(__dirname, 'credentials.json');
            if (fs.existsSync(credentialsPath)) {
                const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
                username = credentials.username;
                password = credentials.password;
            } else {
                throw new Error('Local credentials.json file not found.');
            }
        }

        // Ensure username and password are available
        if (!username || !password) {
            throw new Error('Username or password is missing.');
        }

        // Fill in the login form
        await expect(this.username_textbox).toBeVisible({ timeout: 10000 });
        await this.username_textbox.fill(username);
        await this.password_textbox.fill(password);

        await this.login_button.click();
    }
}
