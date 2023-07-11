import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  replaceTextFieldValue,
  getDateTime,
  wait,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/**
 * Navigates to the Takedown Report list displayer.
 *
 * @param id Optional internal ID of the Takedown Object
 */
export async function navigateToTakedownReport(id = '') {
  await goToObjectOverview('cases', 'rfts', id);
}

/**
 * Assuming we are on the Takedown Report list displayer, click the create
 * button and create a new Takedown Report.
 *
 * @param name The name of the Takedown Report to create.
 * @param description The description of the Takedown Report to create.
 */
export async function addTakedownReport(name: string, description: string) {
  // Click add button
  const addBtn = await getElementWithTimeout(By.id('add-takedown-report'));
  await addBtn.click();

  // Fill name
  const nameField = await getElementWithTimeout(By.id('add-takedown-report-name'));
  // Sometimes fails to find name field fast enough.
  await wait(1000);
  await nameField.click();
  await nameField.sendKeys(name);

  // Fill Report Date
  const reportDate = await getElementWithTimeout(By.id('add-takedown-report-date'));
  await wait(1000);
  await reportDate.click();
  const formattedDate = getDateTime();
  await replaceTextFieldValue(reportDate, formattedDate);
  await wait(1000);

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'case-takedown-report-description',
    'textarea',
  );
  await descriptionField.click();
  await descriptionField.sendKeys(description);

  // Click create button
  const createBtn = await getElementWithTimeout(By.id('add-takedown-report-create'));
  await createBtn.click();
}
/**
 * Hits the close update so the
 * updated feedback can be saved, seen, and checked
 *
 * param id
 */
export async function updateTakedownFeedbackResponse() {
  const updateBtnMenu = await getElementWithTimeout(By.id('close-update'));
  await updateBtnMenu.click();
  await wait(5000);
}

/**
 * Navigates to click the case Takedown Report edit button
 * @param name The new Case Takedown Report name
 * @param description The new Case Takedown Report description
 * @param date The new string representation of the created/edit dated of the report
 */

export async function editTakedownReport(name: string, description: string) {
  // Clicks edit button
  const addBtn = await getElementWithTimeout(By.id('EditIcon'));
  await addBtn.click();

  // Fill name
  const nameField = await getElementWithTimeout(By.id('edit-rfts-name'));
  // Sometimes fails to find name field fast enough.
  await wait(1000);
  await nameField.click();
  await replaceTextFieldValue(nameField, name);
  await wait(500);

  // Fill Report Date
  const reportDate = await getElementWithTimeout(By.id('edit-rfts-date'));
  await wait(1000);
  await reportDate.click();
  await wait(1000);
  const formattedDate = getDateTime();
  await replaceTextFieldValue(reportDate, formattedDate);
  await wait(500);

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'edit-rfts-description',
    'textarea',
  );
  await descriptionField.click();
  await replaceTextFieldValue(descriptionField, description);
  await wait(500);

  await updateTakedownFeedbackResponse();
}

/**
 * Tries to click on an Case Takedown Report with the given name.
 *
 * @param name The name of the Case Takedown Report to select.
 */
export async function selectTakedownReport(name: string) {
  await navigateToTakedownReport();
  await selectObject(name);
}

export async function navigateToTakedownReportHelperSelect(name: string, id = '') {
  navigateToTakedownReport(id);
  selectTakedownReport(name);
}
