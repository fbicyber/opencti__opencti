import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  replaceTextFieldValue,
  getDateTime,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

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
  await getElementWithTimeout(By.id('add-takedown-report'))
    .then((btn) => btn.click());

  // Fill name
  await getElementWithTimeout(By.id('add-takedown-report-name'))
    .then((field) => replaceTextFieldValue(field, name));

  // check name was set properly
  await getElementWithTimeout(By.id('add-takedown-report-name'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(val).toBe(name));

  // Fill Report Date
  await getElementWithTimeout(By.id('add-takedown-report-date'))
    .then((field) => replaceTextFieldValue(field, getDateTime()));

  // Fill description
  await getSubElementWithTimeout('id', 'case-takedown-report-description', 'textarea')
    .then((field) => replaceTextFieldValue(field, description));

  // check description was set properly
  await getSubElementWithTimeout('id', 'case-takedown-report-description', 'textarea')
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(val).toBe(description));

  // Click create button
  await getElementWithTimeout(By.id('add-takedown-report-create'))
    .then((btn) => btn.click());
}

/**
 * Navigates to click the case Takedown Report edit button
 * @param name The new Case Takedown Report name
 * @param description The new Case Takedown Report description
 */

export async function editTakedownReport(name: string, description: string) {
  // Clicks edit button
  await getElementWithTimeout(By.id('EditIcon'))
    .then((btn) => btn.click());

  // Fill name
  await getElementWithTimeout(By.id('edit-rfts-name'))
    .then((field) => replaceTextFieldValue(field, name));

  // check name was set properly
  await getElementWithTimeout(By.id('edit-rfts-name'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(val).toBe(name));

  // Fill Report Date
  await getElementWithTimeout(By.id('edit-rfts-date'))
    .then((field) => replaceTextFieldValue(field, getDateTime()));

  // Fill description
  await getSubElementWithTimeout('id', 'edit-rfts-description', 'textarea')
    .then((field) => replaceTextFieldValue(field, description));

  // check description was set properly
  await getSubElementWithTimeout('id', 'edit-rfts-description', 'textarea')
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(val).toBe(description));

  // click close button
  await getElementWithTimeout(By.id('close-update'))
    .then((btn) => btn.click());
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
