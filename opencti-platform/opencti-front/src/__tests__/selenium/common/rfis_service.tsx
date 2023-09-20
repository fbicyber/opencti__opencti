import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  replaceTextFieldValue,
  wait,
  getDateTime,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/**
 * Navigates to request for information page, or the information list displayer.
 *
 * @param id Optional internal ID of the Information
 */
export async function navigateToRfis(id = '') {
  await goToObjectOverview('cases', 'rfis', id);
}

/**
 * Assuming we are on the Request for Information page, click the create
 * button and create a new Request for Information.
 *
 * @param name The name of the Rfi to create.
 * @param description The description of the Rfi to create.
 */
export async function addRfis(name: string, description: string) {
  // Click add button
  const addBtn = await getElementWithTimeout(By.id('add-rfis'));
  await addBtn.click();

  // Fill name
  const nameField = await getElementWithTimeout(By.id('add-rfis-name'));
  // Sometimes fails to find name field fast enough.
  await wait(1000);
  await nameField.click();
  await nameField.sendKeys(name);

  // Fill RFI Date
  const rfisDate = await getElementWithTimeout(By.id('add-rfis-date'));
  await wait(1000);
  await rfisDate.click();
  const formattedDate = getDateTime();
  await replaceTextFieldValue(rfisDate, formattedDate);
  await wait(1000);

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'add-rfis-description',
    'textarea',
  );
  await wait(1000);
  await descriptionField.click();
  await descriptionField.sendKeys(description);

  // Click create button
  const createBtn = await getElementWithTimeout(By.id('create-rfis'));
  await createBtn.click();
}

/**
 * Tries to click on an RFI with the given name.
 *
 * @param name The new RFI name
 * @param description The new RFI description
 * @param date The new string representation of the created/edit dated of the report
 */
export async function editRfis(name: string, description: string) {
  // Click edit button
  const editBtn = await getElementWithTimeout(By.id('edit-rfis'));
  await editBtn.click();

  // Fill name
  const nameField = await getElementWithTimeout(By.id('edit-rfis-name'));
  // Sometimes fails to find name field fast enough.
  await wait(1000);
  await nameField.click();
  await wait(1000);
  await replaceTextFieldValue(nameField, name);
  await wait(1000);

  // Fill Report Date
  const reportDate = await getElementWithTimeout(By.id('edit-rfis-date'));
  await wait(1000);
  await reportDate.click();
  await wait(1000);
  const formattedDate = getDateTime();
  await replaceTextFieldValue(reportDate, formattedDate);
  await wait(1000);

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'edit-rfis-description',
    'textarea',
  );
  await descriptionField.click();
  await wait(1000);
  await replaceTextFieldValue(descriptionField, description);
  await wait(1000);

  // Click close button
  const closeBtn = await getElementWithTimeout(By.id('edit-close-rfis'));
  await closeBtn.click();
}

/**
 * Tries to click on an Rfis with the given name.
 *
 * @param name The name of the Rfis to select.
 */
export async function selectRfis(name: string) {
  await navigateToRfis();
  await selectObject(name);
}

export async function navigateToRfisHelperSelect(name: string, id = '') {
  navigateToRfis(id);
  selectRfis(name);
}
