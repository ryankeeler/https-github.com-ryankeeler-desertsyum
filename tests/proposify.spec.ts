import { test, expect } from '@playwright/test';
import { navigateToLoginPage } from '../navigation-helpers';
import { LoginPage } from '../pages/LoginPage';
import fs from 'fs';
import { HomePage } from '../pages/HomePage';
import { CreateDocumentPage } from '../pages/CreateDocumentPage';
import { getRandomCredentials, getResourcesPath, loginToProposifyUsingAI } from '../helpers';
import path from 'path';
import { ai } from '@zerostep/playwright';

test('Question 2: Text table', async ({ page }) => {
  try {
    // Navigate to the login page
    await navigateToLoginPage(page);

    // Get the instance of the login page
    const loginPage = await LoginPage.getInstance(page);
    await loginPage.loginToProposify();

    const homePage = await HomePage.getInstance(page);
    await homePage.createNewDocument('Try Editor 3.0');
    await homePage.selectTemplate();

    let createDocumentPage = await CreateDocumentPage.getInstance(page);
    await createDocumentPage.createTableContent('Text Table');
    await createDocumentPage.addTextToTableContent();

    // Get all rows before dragging
    let allRowsBefore = await page.locator('[role="rowgroup"]').locator('[role="row"]').all();
    const rowToDragContent = await allRowsBefore[1].textContent();

    // Perform the drag operation
    await createDocumentPage.dragRow(2, 3);
    let allRowsAfter = await page.locator('[role="rowgroup"]').locator('[role="row"]').all();
    expect(allRowsAfter.length).toBe(allRowsBefore.length);

    // Assert that the dragged row is now in the correct position
    const newPositionContent = await allRowsAfter[2].textContent();
    expect(newPositionContent).toBe(rowToDragContent);

    // Assert that the row that was originally at position 3 has moved up (optional)
    const originalRow2Content = await allRowsBefore[1].textContent();
    const newRow2Content = await allRowsAfter[1].textContent();
    expect(newRow2Content).toBe(originalRow2Content);
  } catch (error) {
    console.error('Error during "Question 2: Text table" test:', error);
    throw error;  // Re-throw the error to ensure the test fails
  }
});

test('Question 2: Pricing table', async ({ page }) => {
  try {
    // Navigate to the login page
    await navigateToLoginPage(page);

    // Get the instance of the login page
    const loginPage = await LoginPage.getInstance(page);
    await loginPage.loginToProposify();

    const homePage = await HomePage.getInstance(page);
    await homePage.createNewDocument('Try Editor 3.0');
    await homePage.selectTemplate();

    let createDocumentPage = await CreateDocumentPage.getInstance(page);
    await createDocumentPage.createTableContent('Pricing Table');
    await createDocumentPage.addTextToTableContent();

    // Get all rows before dragging
    let allRowsBefore = await page.locator('[role="rowgroup"]').locator('[role="row"]').all();
    const rowToDragContent = await allRowsBefore[1].textContent();

    // Perform the drag operation
    await createDocumentPage.dragRow(2, 4);
    await page.waitForTimeout(1000);
    let allRowsAfter = await page.locator('[role="rowgroup"]').locator('[role="row"]').all();
    expect(allRowsAfter.length).toBe(allRowsBefore.length);

    // Assert that the dragged row is now in the correct position
    const newPositionContent = await allRowsAfter[3].textContent();
    expect(newPositionContent).toBe(rowToDragContent);

    // Assert that the row that was originally at position 3 has moved up (optional)
    const originalRow3Content = await allRowsBefore[1].textContent();
    const newRow2Content = await allRowsAfter[1].textContent();
    expect(newRow2Content).toBe(originalRow3Content);
  } catch (error) {
    console.error('Error during "Question 2: Pricing table" test:', error);
    throw error;  // Re-throw the error to ensure the test fails
  }
});

test('Question 3: Resize uploaded image', async ({ page }) => {
  try {
    // Navigate to the login page
    await navigateToLoginPage(page);

    // Get the instance of the login page
    const loginPage = await LoginPage.getInstance(page);
    await loginPage.loginToProposify();

    const homePage = await HomePage.getInstance(page);
    await homePage.createNewDocument('Try Editor 3.0');
    await homePage.selectTemplate();

    let createDocumentPage = await CreateDocumentPage.getInstance(page);
    await createDocumentPage.uploadImage(getResourcesPath(), 'Marvel.png');
    await createDocumentPage.resizeImage('250', '250');

    await createDocumentPage.aspect_ratio_locked_button.click();
    let imageHeight = await createDocumentPage.image_height_textbox.inputValue();
    let imageWidth = await createDocumentPage.image_width_textbox.inputValue();
    await expect(imageHeight).toContain('250');
    await expect(imageWidth).toContain('250');

    await createDocumentPage.resizeImageByDragging();
    imageHeight = await createDocumentPage.image_height_textbox.inputValue();
    imageWidth = await createDocumentPage.image_width_textbox.inputValue();
    await expect(imageHeight).not.toContain('250');
    await expect(imageWidth).not.toContain('250');
  } catch (error) {
    console.error('Error during "Question 3: Resize uploaded image" test:', error);
    throw error;  // Re-throw the error to ensure the test fails
  }
});

// Optional Exercise: Integrating AI
test('Question 3: Resize uploaded image using AI', async ({ page }) => {
  const aiArgs = { page, test };

  try {
    // Navigate to the login page
    await navigateToLoginPage(page);

    let loginPage = await LoginPage.getInstance(page);
    await loginPage.loginToProposify();

    const homePage = await HomePage.getInstance(page);
    await expect(homePage.new_document_button).toBeVisible({ timeout: 10000 });

    // Using AI to clicking on buttons
    await ai('Click on New Document button', aiArgs);
    await ai('Click on Try Editor 3.0 button', aiArgs);

    await homePage.selectTemplate();

    let createDocumentPage = await CreateDocumentPage.getInstance(page);
    await createDocumentPage.uploadImage(getResourcesPath(), 'Marvel.png');
    await createDocumentPage.resizeImage('250', '250');

    await ai('Click on button with lock icon', aiArgs);

    let imageHeight = await createDocumentPage.image_height_textbox.inputValue();
    let imageWidth = await createDocumentPage.image_width_textbox.inputValue();
    expect(imageHeight).toContain('250');
    expect(imageWidth).toContain('250');

    let heightBoolean = await ai('Confirm the input value of Height textbox is 250', aiArgs);
    let widthBoolean = await ai('Confirm the input value of Width textbox is 250', aiArgs);
    expect(heightBoolean).toBe(true);
    expect(widthBoolean).toBe(true);

    await createDocumentPage.resizeImageByDragging();
    imageHeight = await createDocumentPage.image_height_textbox.inputValue();
    imageWidth = await createDocumentPage.image_width_textbox.inputValue();
    expect(imageHeight).not.toContain('250');
    expect(imageWidth).not.toContain('250');

    heightBoolean = await ai('Confirm the input value of Height textbox is 250', aiArgs);
    widthBoolean = await ai('Confirm the input value of Width textbox is 250', aiArgs);
    expect(heightBoolean).toBe(false);
    expect(widthBoolean).toBe(false);
  } catch (error) {
    console.error('Error during "Question 3: Resize uploaded image using AI" test:', error);
    throw error;  // Re-throw the error to ensure the test fails
  }
});
