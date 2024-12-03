import { expect, Locator, Page } from '@playwright/test';
import path from 'path';

export class CreateDocumentPage {
    private page: Page;
    edit_textbox_selector: string = '[data-testid="editor-page"]'
    text_table_selector: string = '[data-testid="text-table-block-button"]'
    pricing_table_selector: string = '[data-testid="pricing-table-block-button"]'
    image_chooser_selector: string = '[class="upload-button-container"]'
    edit_content_selector: string = '[data-testid="resizable-block-wrapper"]'
    drag_cell_selector: string = '[class="MuiDataGrid-rowReorderCell MuiDataGrid-rowReorderCell--draggable"]'
    cell_textbox_selector: string = '[data-testid="render-cell-test"]'
    preview_image_selector: string = '[class="MuiImageListItem-img"]'
    notification_selector: string = '[class="ant-typography proposify-typography default-font desktop"]'
    image_editbox: string = '[data-testid="image-block"]'
    user_dropdown_selector: string = '[class*="ant-dropdown avatar-dropdown ant-dropdown-placement-bottomRight "]'

    content_tab: Locator
    table_content: Locator
    image_content: Locator
    aspect_ratio_locked_button: Locator
    image_height_textbox: Locator
    image_width_textbox: Locator
    image_settings: Locator
    user_icon: Locator

    constructor(page: Page) {
        this.page = page;
    }

    private async initialize() {
        this.content_tab = this.page.locator('[data-node-key="content_tab"]')
        this.table_content = this.page.locator('[data-testid="table-block-button"]')
        this.image_content = this.page.locator('[data-testid="image-block-button"]')
        this.aspect_ratio_locked_button = this.page.locator('[data-testid="aspect-ratio-lock-button"]')
        this.image_height_textbox = this.page.locator('[data-testid="image-height-input"]').locator('[type="number"]')
        this.image_width_textbox = this.page.locator('[data-testid="image-width-input"]').locator('[type="number"]')
        this.image_settings = this.page.locator('[data-testid="IMAGE-settings-icon"]')
        this.user_icon = this.page.locator('[data-testid="avatar-button"]')

    }

    static async getInstance(page) {
        const instance = new CreateDocumentPage(page);
        await instance.initialize();
        return instance;
    }

    async createTableContent(tableType: 'Text Table' | 'Pricing Table') {
        await expect(this.content_tab).toBeVisible();
        await this.content_tab.click();

        await this.table_content.click();
        const textTableButton = this.page.locator(this.text_table_selector);
        const pricingTableButton = this.page.locator(this.pricing_table_selector);

        const editTextbox = this.page.locator(this.edit_textbox_selector);
        await expect(editTextbox).toBeVisible();

        const editTextboxBoundingBox = await editTextbox.boundingBox();
        if (editTextboxBoundingBox === null) {
            throw new Error('Edit textbox bounding box not found.');
        }

        if (tableType === 'Pricing Table') {
            await pricingTableButton.dragTo(editTextbox, {
                targetPosition: { x: 0, y: editTextboxBoundingBox.height / 2 }
            });
        } else if (tableType === 'Text Table') {
            await textTableButton.dragTo(editTextbox, {
                targetPosition: { x: 0, y: editTextboxBoundingBox.height / 2 }
            });
        }
    }

    async addTextToTableContent() {
        let editContentContainer = await this.page.locator(this.edit_content_selector);
        await expect(editContentContainer).toBeVisible();
        await editContentContainer.click();

        await expect(editContentContainer.locator('[role="rowgroup"]')).toBeVisible(); //add selectors at the top
        let allRows = await editContentContainer.locator('[role="rowgroup"]').locator('[role="row"]').all();
        await allRows[1].dblclick({ force: true });

        let allCellTexts = await this.page.locator('[data-testid="render-cell-test"]').all();

        // Add text to all cells
        for (let i = 0; i < allCellTexts.length; i++) {
            await this.page.evaluate((index) => {
                const elements = document.querySelectorAll('[data-testid="render-cell-test"]');
                if (elements[index]) {
                    elements[index].textContent = `Cell content ${index + 1}`;
                }
            }, i);
        }
    }

    async dragRow(sourceIndex: number, targetIndex: number) {
        let allDraggableRows = await this.page.locator('[data-field="__reorder__"]').all();

        if (sourceIndex < 0 || sourceIndex >= allDraggableRows.length ||
            targetIndex < 0 || targetIndex >= allDraggableRows.length) {
            throw new Error("Invalid source or target index");
        }
        await allDraggableRows[sourceIndex].dragTo(allDraggableRows[targetIndex]);
    }

    async uploadImage(fileDirectoryPath: string, filename: string) {
        const file = path.join(fileDirectoryPath, filename);
        await this.content_tab.click();
        await this.image_content.click();

        await expect(this.page.locator(this.image_chooser_selector)).toBeVisible();
        const fileChooserPromise = this.page.waitForEvent("filechooser");
        await this.page.locator(this.image_chooser_selector).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(file);

        await expect(this.page.locator(this.notification_selector).last()).toBeVisible({ timeout: 5000 });

        const editTextbox = this.page.locator(this.edit_textbox_selector);
        await expect(editTextbox).toBeVisible();

        const editTextboxBoundingBox = await editTextbox.boundingBox();
        if (editTextboxBoundingBox === null) {
            throw new Error('Edit textbox bounding box not found.');
        }

        await expect(this.page.locator(this.preview_image_selector)).toBeVisible();
        await this.page.locator(this.preview_image_selector).dragTo(editTextbox, {
            targetPosition: { x: 0, y: editTextboxBoundingBox.height / 2 }
        });
    }

    async resizeImage(height: string, width: string) {
        await this.image_settings.click({ force: true })
        await expect(this.aspect_ratio_locked_button).toBeVisible()
        await this.aspect_ratio_locked_button.click();

        await this.image_height_textbox.fill(height)
        await this.image_width_textbox.fill(width)

        await this.aspect_ratio_locked_button.click();
    }

    async resizeImageByDragging() {
        // Select the element you want to drag
        const dragElement = this.page.locator('div:nth-child(4) > div:nth-child(4)');

        // Select the target element where you want to drop (editTextbox)
        const editTextbox = this.page.locator(this.edit_textbox_selector);

        // Ensure both elements are visible
        await expect(dragElement).toBeVisible();
        await expect(editTextbox).toBeVisible();

        // Get the bounding box of the drag element
        const dragRect = await dragElement.boundingBox();
        if (!dragRect) {
            throw new Error('Could not get bounding box of the drag element.');
        }

        // Get the bounding box of the target element (editTextbox)
        const targetRect = await editTextbox.boundingBox();
        if (!targetRect) {
            throw new Error('Could not get bounding box of the target element.');
        }

        // Calculate the center position of the target element for X (horizontal)
        const targetX = targetRect.x + targetRect.width / 2;  // Horizontal center of the target element

        // Calculate the bottom position of the target element for Y (vertical)
        const targetY = targetRect.y + targetRect.height; // Bottom of the target element

        // Calculate the starting position (center of the drag element for X and bottom of the drag element for Y)
        const startX = dragRect.x + dragRect.width / 2;  // Horizontal center of the drag element
        const startY = dragRect.y + dragRect.height; // Bottom of the drag element

        // Move the mouse to the start position (center of the drag element)
        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();  // Press the mouse to start dragging

        // Move the mouse to the center horizontally (targetX) and bottom vertically (targetY) of the target element
        await this.page.mouse.move(targetX, targetY);

        // Release the mouse button to drop the element
        await this.page.mouse.up();
    }
}
