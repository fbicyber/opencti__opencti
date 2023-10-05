import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  wait,
  replaceTextFieldValue,
  selectRandomFromDropdown,
  getDropdownSelectorWithName,
  compareDateString,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

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
  await getElementWithTimeout(By.id('add-observed-data'))
    .then((btn) => btn.click());
  await wait(2000);

  // Fill entity
  const entity = await selectRandomFromDropdown(getDropdownSelectorWithName('objects'));

  // Fill First Observed Date
  await getElementWithTimeout(By.id('add-observed-data-first-date'))
    .then((field) => replaceTextFieldValue(field, firstDate));
  await wait(2000);

  // check that first observed date set correctly
  await getElementWithTimeout(By.id('add-observed-data-first-date'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(compareDateString(val, firstDate)).toBe(true));

  // Fill Last Observed Date
  await getElementWithTimeout(By.id('add-observed-data-last-date'))
    .then((field) => replaceTextFieldValue(field, lastDate));
  await wait(2000);

  // check that last observed date set correctly
  await getElementWithTimeout(By.id('add-observed-data-last-date'))
    .then((elem) => elem.getAttribute('value'))
  // .then((elem) => elem.getText())
    .then((val) => expect(compareDateString(val, lastDate)).toBe(true));

  // Click create button
  await getElementWithTimeout(By.id('add-observed-data-create'))
    .then((btn) => btn.click());

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
  await getElementWithTimeout(By.id('EditIcon'))
    .then((btn) => btn.click());

  // Updates First Observed Date
  await getElementWithTimeout(By.id('edit-observed-data-first-date'))
    .then((field) => replaceTextFieldValue(field, firstDate));
  await wait(2000);

  // check that first observed date set correctly
  await getElementWithTimeout(By.id('edit-observed-data-first-date'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(compareDateString(val, firstDate)).toBe(true));

  // Updates Last Observed Date
  await getElementWithTimeout(By.id('edit-observed-data-last-date'))
    .then((field) => replaceTextFieldValue(field, lastDate));
  await wait(2000);

  // check that last observed date set correctly
  await getElementWithTimeout(By.id('edit-observed-data-last-date'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(compareDateString(val, lastDate)).toBe(true));

  // Click close button
  await getElementWithTimeout(By.id('CloseIcon'))
    .then((btn) => btn.click());
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
