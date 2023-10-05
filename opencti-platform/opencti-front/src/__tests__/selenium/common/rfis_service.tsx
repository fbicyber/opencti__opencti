import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  replaceTextFieldValue,
  wait,
  getDateTime,
  compareDateString,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

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
  await getElementWithTimeout(By.id('add-rfis'))
    .then((btn) => btn.click());

  // Fill name
  await getElementWithTimeout(By.id('add-rfis-name'))
    .then((field) => replaceTextFieldValue(field, name));
  await wait(2000);

  await getElementWithTimeout(By.id('add-rfis-name'))
    .then((elem) => elem.getAttribute('value')) // appears that .getText() fails for some reason
    .then((val) => expect(val).toBe(name));

  // Fill RFI Date
  const formattedDate = getDateTime();
  await getElementWithTimeout(By.id('add-rfis-date'))
    .then((field) => replaceTextFieldValue(field, formattedDate));
  await wait(2000);

  // check date was changed correctly
  await getElementWithTimeout(By.id('add-rfis-date'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(compareDateString(val, formattedDate)).toBe(true));

  // Fill description
  await getElementWithTimeout(By.className('mde-text'))
    .then((field) => replaceTextFieldValue(field, description));
  await wait(2000);

  // check that description is changed
  await getElementWithTimeout(By.className('mde-text'))
    .then((elem) => elem.getText())
    .then((val) => expect(val).toBe(description));

  // Click create button
  await getElementWithTimeout(By.id('create-rfis'))
    .then((btn) => btn.click());
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
  await getElementWithTimeout(By.id('edit-rfis'))
    .then((btn) => btn.click());

  // Fill name
  await getElementWithTimeout(By.id('edit-rfis-name'))
    .then((field) => replaceTextFieldValue(field, name));
  await wait(2000);

  // check name
  await getElementWithTimeout(By.id('edit-rfis-name'))
    .then((elem) => elem.getAttribute('value')) // appears that .getText() fails for some reason
    .then((val) => expect(val).toBe(name));

  // Fill Report Date
  const formattedDate = getDateTime();
  await getElementWithTimeout(By.id('edit-rfis-date'))
    .then((field) => replaceTextFieldValue(field, formattedDate));
  await wait(2000);

  // check date was changed correctly
  await getElementWithTimeout(By.id('edit-rfis-date'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(compareDateString(val, formattedDate)).toBe(true));

  // Fill description
  await getElementWithTimeout(By.className('mde-text'))
    .then((field) => replaceTextFieldValue(field, description));
  await wait(2000);

  // check that description is changed
  await getElementWithTimeout(By.className('mde-text'))
    .then((elem) => elem.getText())
    .then((val) => expect(val).toBe(description));

  // Click close button
  await getElementWithTimeout(By.id('edit-close-rfis'))
    .then((btn) => btn.click());
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
