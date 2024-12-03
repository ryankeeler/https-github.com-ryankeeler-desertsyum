import { Page } from "@playwright/test";
import { links } from "./globals";

async function navigateToPage(page: Page, url): Promise<boolean> {
    try {
        await page.goto(url)
        await this.page.waitForNavigation()
        return true;
    }
    catch (e) {
        return false;
    }
}

async function navigateToLoginPage(page: Page) {
    await navigateToPage(page, links.proposify.loginpage)
}

export {
    navigateToLoginPage
}