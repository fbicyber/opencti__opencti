import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  replaceTextFieldValue,
  wait,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

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
  const addBtn = await getElementWithTimeout(By.id('feedback-button'));
  await addBtn.click();

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'case-feedback-response-description',
    'textarea',
  );

  await descriptionField.click();
  await descriptionField.sendKeys(description);
  // await attachToFeedbackResponse();

  // Click create button
  const createBtn = await getElementWithTimeout(By.id('add-feedback-response-create'));
  await createBtn.click();
}

/**
 * Navigates to click the case Feedback response edit button
 * @param description Updates the Case Feedback Response Description
 */
export async function editCaseFeedbackResponse(description: string) {
  // Click edit icon
  const editBtn = await getElementWithTimeout(By.id('EditIcon'));
  await editBtn.click();

  // Updates Description
  const updatedDescriptionField = await getSubElementWithTimeout(
    'id',
    'edit-case-feedback-description',
    'textarea',
  );
  await wait(2000);
  await updatedDescriptionField.click();
  await wait(1000);
  await replaceTextFieldValue(updatedDescriptionField, description);
  await wait(1000);

  // Click close button
  const updateBtnMenu = await getElementWithTimeout(By.id('close-update'));
  await updateBtnMenu.click();
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
