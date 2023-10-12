import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  replaceTextFieldValue,
  wait,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

/**
 * Navigates to the Cases Feedback list displayer.
 *
 * @param id Optional internal ID of the Case Object
 */
export async function navigateToCaseFeedback(id = '') {
  await goToObjectOverview('cases', 'feedbacks', id);
}
/**
 * Press the profile button in top corner of top bar
 * to open up the profile menu
 *
*/
export async function pressProfileButton() {
  const pressProfileButton_btn = await getElementWithTimeout(By.id('profile-menu-button'));
  await pressProfileButton_btn.click();
}

/**
 * Attaches a file to feedback response
 *
 */
export async function attachToFeedbackResponse() {
  // TODO -- not used/functional
  const addBtn = await getElementWithTimeout(By.id('add-feedback-file'));
  await addBtn.click();
}

/**
 * Assuming we are on the Cases Feedback Response list displayer, click the create
 * button and create a new Feedback Response.
 *
 * param name The name of the Feedback Response to create.
 * @param description The description of the Feedback Response to create.
 */
export async function addCaseFeedbackResponse(description: string) {
  // Click feedback button
  await getElementWithTimeout(By.id('feedback-button'))
    .then((btn) => btn.click());

  // Fill description
  await getElementWithTimeout(By.className('mde-text'))
    .then((field) => replaceTextFieldValue(field, description));
  await wait(2000);

  // check that the description set correctly
  await getElementWithTimeout(By.className('mde-text'))
    .then((elem) => elem.getText())
    .then((val) => expect(val).toBe(description));

  // Click create button
  await getElementWithTimeout(By.id('add-feedback-response-create'))
    .then((btn) => btn.click());
}

/**
 * Navigates to click the case Feedback response edit button
 * @param description Updates the Case Feedback Response Description
 */
export async function editCaseFeedbackResponse(name: string, description: string) {
  // Click edit icon

  await getElementWithTimeout(By.id('EditIcon'))
    .then((btn) => btn.click());

  // Update the name
  await getElementWithTimeout(By.name('name'))
    .then((field) => replaceTextFieldValue(field, name));
  await wait(2000);

  // check that the name has been updated
  await getElementWithTimeout(By.name('name'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(val).toBe(name));

  // Update Description
  await getElementWithTimeout(By.className('mde-text'))
    .then((field) => replaceTextFieldValue(field, description));
  await wait(2000);

  // check description
  await getElementWithTimeout(By.className('mde-text'))
    .then((elem) => elem.getText())
    .then((val) => expect(val).toBe(description));

  // Click close button
  await getElementWithTimeout(By.id('close-update'))
    .then((btn) => btn.click());
}

/**
 * Tries to click on an Case Feedback Response with the given name.
 *
 * @param name The name of the Case Feedback Response to select.
 */
export async function selectCaseFeedbackResponse(name: string) {
  await navigateToCaseFeedback();
  await selectObject(name);
}
