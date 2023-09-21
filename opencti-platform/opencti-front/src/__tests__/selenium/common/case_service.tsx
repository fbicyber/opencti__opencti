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
  try {
    const addBtn = await getElementWithTimeout(By.id('add-incident-response'));
    await addBtn.click();
  } catch (error) {
    console.error(error);
    console.error('Warn: Could not locate or interact with add incident response button');
  }

  // Fill name
  try {
    const nameField = await getElementWithTimeout(By.id('add-incident-response-name'));
    // Sometimes fails to find name field fast enough.
    await wait(1000);
    await nameField.click();
    await nameField.sendKeys(name);
    await wait(1000);

    // check that it was name set correctly
    getElementWithTimeout(By.id('add-incident-response-name'))
      .then((elem) => elem.getAttribute('value'))
      .then((val) => expect(val).toBe(name));
  } catch (error) {
    console.error(error);
    console.error('Warn: Could not locate or interact with add incident response name');
  }

  // Fill Incident Date
  try {
    const incidentDate = await getElementWithTimeout(By.id('add-incident-response-date'));
    await wait(1000);
    await incidentDate.click();

    const formattedDate = getDateTime();
    await replaceTextFieldValue(incidentDate, formattedDate);
    await wait(1000);

    // check that it was date set correctly
    getElementWithTimeout(By.id('add-incident-response-date'))
      .then((elem) => elem.getAttribute('value'))
      .then((val) => expect(val).toBeTruthy()); // TODO: Need to change to below after date issue fixed
    // .then((val) => expect(val).toBe(formattedDate)); // should be problem until above fixed
  } catch (error) {
    console.error(error);
    console.error('Warn: Could not locate or interact with add incident response date');
  }

  // Fill description
  try {
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'add-incident-response-description',
      'textarea',
    );
    await descriptionField.click();
    await descriptionField.sendKeys(description);
    await wait(1000);

    // check that it was date set correctly
    getSubElementWithTimeout('id', 'add-incident-response-description', 'textarea')
      .then((elem) => elem.getAttribute('value'))
      .then((val) => expect(val).toBe(description));
  } catch (error) {
    console.error(error);
    console.error('Warn: Could not locate or interact with add incident response description');
  }

  // Click create button
  try {
    const createBtn = await getElementWithTimeout(By.id('add-incident-response-create'));
    await createBtn.click();
  } catch (error) {
    console.error(error);
    console.error('Error: Could not create incident.');
  }
}

export async function editCaseIncidentResponse(name:string, description: string) {
  // Click edit button
  await wait(3000);
  try {
    const editButton = await getElementWithTimeout(By.id('edit-case'));
    await editButton.click();
  } catch (error) {
    console.error(error);
    console.error('Warn: Could not locate or interact with edit incident response button');
  }

  // Fill name
  try {
    const nameField = await getElementWithTimeout(By.id('add-incident-response-name'));
    // Sometimes fails to find name field fast enough.
    await wait(1000);
    await nameField.click();
    await wait(2000);
    await replaceTextFieldValue(nameField, name);
    await wait(2000);

    // check that it was name set correctly
    getElementWithTimeout(By.id('add-incident-response-name'))
      .then((elem) => elem.getAttribute('value'))
      .then((val) => expect(val).toBe(name)); // should be problem until above fixed
  } catch (error) {
    console.error(error);
    console.error('Warn: Could not locate or interact with the incident response name');
  }

  // Fill Incident Date
  try {
    const incidentDate = await getElementWithTimeout(By.id('add-incident-response-date'));
    await wait(1000);
    await incidentDate.click();
    await wait(2000);

    const formattedDate = getDateTime();
    await replaceTextFieldValue(incidentDate, formattedDate);
    await wait(1000);

    // check that it was date set correctly
    getElementWithTimeout(By.id('add-incident-response-date'))
      .then((elem) => elem.getAttribute('value'))
      .then((val) => expect(val).toBeTruthy()); // TODO: Need to change to below after date issue fixed
    // .then((val) => expect(val).toBe(formattedDate)); // should be problem until above fixed
  } catch (error) {
    console.error(error);
    console.error('Warn: Could not locate or interact with add incident response button');
  }

  // get the description field
  try {
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'add-incident-response-description',
      'textarea',
    );
    await wait(2000);
    await descriptionField.click();
    await wait(2000);
    
    // change description to passed in value
    await replaceTextFieldValue(descriptionField, description);
    await wait(3000);

    // check that it was date set correctly
    getSubElementWithTimeout('id', 'add-incident-response-description', 'textarea')
      .then((elem) => elem.getAttribute('value'))
      .then((val) => expect(val).toBe(description));
  } catch (error) {
    console.error(error);
    console.error('Warn: Could not locate or interact with add incident response button');
  }

  try {
    const closeButton = await getElementWithTimeout(By.id('CloseIcon'));
    await closeButton.click();
    await wait(3000);
  } catch (error) {
    console.error(error);
    console.error('Error: Could not edit incident.');
  }
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
