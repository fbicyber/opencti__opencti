import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
  replaceTextFieldValue,
  getDateTime,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

/**
 * Navigates to the Cases Incident Response list displayer.
 *
 * @param id Optional internal ID of the Case Object
 */
export async function navigateToCaseIncidentResponse(id = '') {
  await goToObjectOverview('cases', 'incidents', id);
}

/**
 * Assuming we are on the Cases Incident Response list displayer, click the create
 * button and create a new Incident Response.
 *
 * @param name The name of the Incident Response to create.
 * @param description The description of the Incident Response to create.
 */
export async function addCaseIncidentResponse(name: string, description: string) {
  // Click add button
  await getElementWithTimeout(By.id('add-incident-response'))
    .then((btn) => btn.click());

  // Fill name
  await getElementWithTimeout(By.id('add-incident-response-name'))
    .then((field) => replaceTextFieldValue(field, name));
  await wait(2000);

  // check that it was name set correctly
  await getElementWithTimeout(By.id('add-incident-response-name'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(val).toBe(name));

  // Fill Incident Date
  const formattedDate = getDateTime();
  await getElementWithTimeout(By.id('add-incident-response-date'))
    .then((field) => replaceTextFieldValue(field, formattedDate));
  await wait(2000);

  // Fill description
  await getSubElementWithTimeout('id', 'add-incident-response-description', 'textarea')
    .then((field) => replaceTextFieldValue(field, description));
  await wait(2000);

  // check that it was date set correctly
  await getSubElementWithTimeout('id', 'add-incident-response-description', 'textarea')
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(val).toBe(description));

  // Click create button
  await getElementWithTimeout(By.id('add-incident-response-create'))
    .then((btn) => btn.click());
}

export async function editCaseIncidentResponse(name:string, description: string) {
  // Click edit button
  await getElementWithTimeout(By.id('edit-case'))
    .then((btn) => btn.click());

  // Fill name
  await getElementWithTimeout(By.id('add-incident-response-name'))
    .then((field) => replaceTextFieldValue(field, name));
  await wait(2000);

  // check that it was name set correctly
  await getElementWithTimeout(By.id('add-incident-response-name'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(val).toBe(name));

  // Fill Incident Date
  const formattedDate = getDateTime();
  await getElementWithTimeout(By.id('add-incident-response-date'))
    .then((field) => replaceTextFieldValue(field, formattedDate));
  await wait(2000);

  // get the description field
  await getSubElementWithTimeout('id', 'add-incident-response-description', 'textarea')
    .then((field) => replaceTextFieldValue(field, description));
  await wait(2000);

  // check that it was date set correctly
  await getSubElementWithTimeout('id', 'add-incident-response-description', 'textarea')
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(val).toBe(description));

  await getElementWithTimeout(By.id('CloseIcon'))
    .then((btn) => btn.click());
}

/**
 * Tries to click on a Case Incident Response with the given name.
 *
 * @param name The name of the Case Incident Response to select.
 */
export async function selectCaseIncidentResponse(name: string) {
  await navigateToCaseIncidentResponse();
  await selectObject(name);
}

export async function navigateToCaseIncidentResponseHelperSelect(name: string, id = '') {
  navigateToCaseIncidentResponse(id);
  selectCaseIncidentResponse(name);
}
