import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  wait,
  replaceTextFieldValue,
  selectRandomFromDropdown,
  getDropdownSelectorWithName,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/**
 * Navigates to the Event Observed Data list displayer.
 *
 * @param id Optional internal ID of the Event Observed Data
 */
export async function navigateToEventObservedData(id = '?sortBy=created&orderAsc=false') {
  await goToObjectOverview('events', 'observed_data', id);
}

/**
 * Assuming we are on the Event Observed Data list displayer, click the create
 * button and create a new Event Observed Data.
 *
 * @param firstDate The first observed date of the Event Observed Data to create.
 * @param lastDate The last observed date of the Event Observed Data to create.
 * @returns The entity name for the Event Observed Data
 */
export async function addEventObservedData(firstDate: string, lastDate: string) {
  // Click add button
  const addBtn = await getElementWithTimeout(By.id('add-observed-data'));
  await addBtn.click();
  await wait(2000);

  // Fill entity
  await wait(1000);
  const entity = await selectRandomFromDropdown(getDropdownSelectorWithName('objects'));

  // Fill First Observed Date
  const firstReportDate = await getElementWithTimeout(By.id('add-observed-data-first-date'));
  await wait(1000);
  await firstReportDate.click();
  await replaceTextFieldValue(firstReportDate, firstDate);
  await wait(1000);
  // Fill Last Observed Date
  const lastReportDate = await getElementWithTimeout(By.id('add-observed-data-last-date'));
  await wait(1000);
  await lastReportDate.click();
  await replaceTextFieldValue(lastReportDate, lastDate);
  await wait(1000);
  // Click create button
  const createBtn = await getElementWithTimeout(By.id('add-observed-data-create'));
  await createBtn.click();

  // Returns entity
  return entity;
}

/**
 * Tries to edit an Event Observed Data.
 *
 * @param firstDate The new Event Observed Data first observed date
 * @param lastDate The new Event Observed Data last observed date
 */
export async function editEventObservedData(firstDate: string, lastDate: string) {
  // Click edit button
  const editBtn = await getElementWithTimeout(By.id('EditIcon'));
  await editBtn.click();

  // Updates First Observed Date
  const firstUpdatedDate = await getElementWithTimeout(By.id('edit-observed-data-first-date'));
  await wait(1000);
  await firstUpdatedDate.click();
  await replaceTextFieldValue(firstUpdatedDate, firstDate);
  await wait(500);

  // Updates Last Observed Date
  const lastUpdatedDate = await getElementWithTimeout(By.id('edit-observed-data-last-date'));
  await wait(1000);
  await lastUpdatedDate.click();
  await replaceTextFieldValue(lastUpdatedDate, lastDate);
  await wait(500);

  // Click close button
  const closeBtn = await getElementWithTimeout(By.id('CloseIcon'));
  await closeBtn.click();
}

/**
 * Tries to click on an Event Observed Data with the given name.
 *
 * @param entity The entity of the Event Observed Data to select.
 */
export async function selectEventObservedData(entity: string) {
  await navigateToEventObservedData();
  await selectObject(entity);
}

export async function navigateToEventObservedDataHelperSelect(entity: string, id = '') {
  navigateToEventObservedData(id);
  selectEventObservedData(entity);
}
