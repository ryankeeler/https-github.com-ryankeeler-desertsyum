import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
    private page: Page;
    new_document_dropdown_selector: string = '.MuiPaper-root'
    modal_selector: string = '[role="dialog"]'
    template_row_selector: string = 'table > tbody > tr'
    new_document_button: Locator;

    constructor(page: Page) {
        this.page = page;
    }

    private async initialize() {
        this.new_document_button = await this.page.getByRole('button', { name: 'New Document' })

    }

    static async getInstance(page) {
        const instance = new HomePage(page);
        await instance.initialize();
        return instance;
    }

    async createNewDocument(documentType: 'Try Editor 3.0' | 'Create document') {
        await expect(this.new_document_button).toBeVisible({ timeout: 10000 });
        await this.new_document_button.click();

        let newDocumentDropdown = await this.page.locator(this.new_document_dropdown_selector).last();
        await expect(newDocumentDropdown).toBeVisible();
        await expect(newDocumentDropdown.locator('[role="menuitem"]').getByText(documentType)).toBeEnabled();
        await newDocumentDropdown.locator('[role="menuitem"]').getByText(documentType).click();
    }

    async selectTemplate(templateName?: string) {
        let modalLocator = await this.page.locator(this.modal_selector).filter({ hasText: 'Select a template' })
        if (templateName) {
            const templateTableRow = await modalLocator.locator(this.template_row_selector);
            await expect(templateTableRow.first()).toBeVisible();
            const templateExists = await templateTableRow.locator(`text=${templateName}`).count();

            if (templateExists > 0) {
                await templateTableRow.locator(`text=${templateName}`).click();
                return;
            } else {
                console.log(`Template "${templateName}" not found. Falling back to "Start from scratch".`);
            }
        }
        await modalLocator.getByRole('button', { name: 'Start from scratch' }).click();
    }
}
