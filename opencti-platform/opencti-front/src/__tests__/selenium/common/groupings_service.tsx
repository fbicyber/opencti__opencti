import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
  replaceTextFieldValue,
  selectRandomFromDropdown,
  getDropdownSelectorWithName,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

/**
 * Navigates to the Analyses Grouping list displayer.
 *
 * @param id Optional internal ID of the Analysis Object
 */
export async function navigateToAnalysesGroupings(id = '?sortBy=created&orderAsc=false') {
  await goToObjectOverview('analyses', 'groupings', id);
}

/**
 * Assuming we are on the Analyses Grouping list displayer, click the create
 * button and create a new Analyses Grouping.
 *
 * @param name The name of the Analyses Groupings to create.
 * @param description The description of the Analyses Groupings to create.
 */
export async function addAnalysesGroupings(name: string, description: string) {
  // Click add button
  try {
    const addBtn = await getElementWithTimeout(By.id('add-analyses-groupings'));
    await addBtn.click();
    await wait(2000);
  } catch (error) {
    console.error('Unable to interact with with add analyses grouping button');
    throw error;
  }

  // Fill name
  try {
    const nameField = await getElementWithTimeout(By.id('add-analyses-groupings-name'));
    await wait(2000);
    await nameField.click();
    await nameField.sendKeys(name);

    // validate name changed
    await getElementWithTimeout(By.id('add-analyses-groupings-name'))
      .then((elem) => elem.getAttribute('value'))
      .then((val) => expect(val).toBe(name));
  } catch (error) {
    console.error('Unable to fill analyses grouping name');
    throw error;
  }

  // Fill context
  try {
    await wait(1000);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = await selectRandomFromDropdown(getDropdownSelectorWithName('context'));
  } catch (error) {
    console.error('Unable to fill analyses grouping context');
    throw error;
  }

  // Fill description
  try {
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'add-analyses-groupings-description',
      'textarea',
    );
    await descriptionField.click();
    await descriptionField.sendKeys(description);

    await getSubElementWithTimeout('id', 'add-analyses-groupings-description', 'textarea')
      .then((elem) => elem.getAttribute('value'))
      .then((val) => expect(val).toBe(description));
  } catch (error) {
    console.error('Unable to edit description analyses grouping field');
    throw error;
  }

  // Click create button
  try {
    const createBtn = await getElementWithTimeout(By.id('add-analyses-groupings-create'));
    await createBtn.click();
  } catch (error) {
    console.error('Unable to create analyses grouping');
    throw error;
  }
}

/**
 * Tries to edit a Case Analysis Groupings with the given name.
 *
 * @param name The new Case Analyses Groupings name
 * @param description The new Case Analyses Groupings description
 */
export async function editAnalysesGroupings(name: string, description: string) {
  // Click edit button
  try {
    await wait(2000);
    const editBtn = await getElementWithTimeout(By.id('EditIcon'));
    await editBtn.click();
  } catch (error) {
    console.error('Unable to interact with edit button for analyses groupings');
    throw error;
  }

  // Fill name
  try {
    const nameField = await getElementWithTimeout(By.id('edit-analyses-groupings-name'));
    await wait(2000);
    await nameField.click();
    await wait(1000);

    // change the name
    await replaceTextFieldValue(nameField, name);
    await wait(1000);

    // validate that name was changed
    await getElementWithTimeout(By.id('edit-analyses-groupings-name'))
      .then((elem) => elem.getAttribute('value'))
      .then((val) => expect(val).toBe(name));
  } catch (error) {
    console.error('Unable to edit name field for analyses grouping');
    throw error;
  }

  // Fill context
  try {
    await wait(1000);
    const _ = await selectRandomFromDropdown(getDropdownSelectorWithName('context'));
  } catch (error) {
    console.error('Unable to edit context for analyses grouping');
    throw error;
  }

  // Fill description
  try {
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'edit-analyses-groupings-description',
      'textarea',
    );
    await wait(1000);
    await descriptionField.click();
    await wait(1000);

    // change the description
    await replaceTextFieldValue(descriptionField, description);
    await wait(1000);

    // validate that description field changed
    await getSubElementWithTimeout('id', 'edit-analyses-groupings-description', 'textarea')
      .then((elem) => elem.getAttribute('value'))
      .then((val) => expect(val).toBe(description));
  } catch (error) {
    console.error('Unable to edit description for analyses grouping');
    throw error;
  }

  // Click close button
  try {
    const closeBtn = await getElementWithTimeout(By.id('CloseIcon'));
    await closeBtn.click();
  } catch (error) {
    console.error('Unable to save edits for analyses grouping');
    throw error;
  }
}

/**
 * Tries to click on an Case Analysis Groupings with the given name.
 *
 * @param name The name of the Case Analysis Groupings to select.
 */
export async function selectAnalysesGroupings(name: string) {
  await navigateToAnalysesGroupings();
  await selectObject(name);
}

export async function navigateToAnalysisGroupingsHelperSelect(name: string, id = '') {
  navigateToAnalysesGroupings(id);
  selectAnalysesGroupings(name);
}
