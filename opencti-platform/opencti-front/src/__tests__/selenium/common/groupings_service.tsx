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
  const addBtn = await getElementWithTimeout(By.id('add-analyses-groupings'));
  await addBtn.click();
  await wait(2000);

  // Fill name
  const nameField = await getElementWithTimeout(By.id('add-analyses-groupings-name'));
  // Sometimes fails to find name field fast enough.
  await wait(2000);
  await nameField.click();
  await nameField.sendKeys(name);

  // Fill context
  await wait(1000);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unusedContext = await selectRandomFromDropdown(getDropdownSelectorWithName('context'));

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'add-analyses-groupings-description',
    'textarea',
  );
  await descriptionField.click();
  await descriptionField.sendKeys(description);

  // Click create button
  const createBtn = await getElementWithTimeout(By.id('add-analyses-groupings-create'));
  await createBtn.click();
}
/**
 * Tries to edit a Case Analysis Groupings with the given name.
 *
 * @param name The new Case Analyses Groupings name
 * @param description The new Case Analyses Groupings description
 */
export async function editAnalysesGroupings(name: string, description: string) {
  // Click edit button
  const editBtn = await getElementWithTimeout(By.id('EditIcon'));
  await editBtn.click();

  // Fill name
  const nameField = await getElementWithTimeout(By.id('edit-analyses-groupings-name'));
  // Sometimes fails to find name field fast enough.
  await wait(2000);
  await nameField.click();
  await wait(1000);
  await replaceTextFieldValue(nameField, name);
  await wait(1000);

  // Fill context
  await wait(1000);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unusedContext = await selectRandomFromDropdown(getDropdownSelectorWithName('context'));

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'edit-analyses-groupings-description',
    'textarea',
  );
  await wait(1000);
  await descriptionField.click();
  await wait(1000);
  await replaceTextFieldValue(descriptionField, description);
  await wait(1000);

  // Click close button
  const closeBtn = await getElementWithTimeout(By.id('CloseIcon'));
  await closeBtn.click();
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
