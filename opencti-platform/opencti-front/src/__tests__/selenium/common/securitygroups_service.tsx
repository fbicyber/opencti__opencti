import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
  replaceTextFieldValue,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

/**
 * Navigates to the Security Groups list displayer.
 *
 * @param id Optional internal ID of the Security Group
 */
export async function navigateToSecurityGroups(id = '?sortBy=created_at&orderAsc=false') {
  await goToObjectOverview('settings/accesses', 'groups', id);
}

/**
 * Assuming we are on the Security Group list displayer, click the create
 * button and create a new Security Group.
 *
 * @param name The name of the Security Group to create.
 * @param description The description of the Security Group to create.
 */
export async function addSecurityGroups(name: string, description: string) {
  // Click add button
  await getElementWithTimeout(By.id('add-security-groups'))
    .then((btn) => btn.click());
  await wait(2000);

  // Fill name
  await getElementWithTimeout(By.id('add-security-groups-name'))
    .then((field) => replaceTextFieldValue(field, name));
  await wait(2000);

  // check name filled correctly
  await getElementWithTimeout(By.id('add-security-groups-name'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(val).toBe(name));

  // Fill description
  await getSubElementWithTimeout('id', 'add-security-groups-description', 'textarea')
    .then((field) => replaceTextFieldValue(field, description));
  await wait(2000);

  // check the description was set correctly
  await getSubElementWithTimeout('id', 'add-security-groups-description', 'textarea')
    .then((elem) => elem.getText())
    .then((val) => expect(val).toBe(description));

  // Click create button
  await getElementWithTimeout(By.id('add-security-groups-create'))
    .then((btn) => btn.click());
}
/**
 * Tries to edit a Security Group with the given name.
 *
 * @param name The new Security Group name
 * @param description The new Security Group description
 */
export async function editSecurityGroups(name: string, description: string) {
  // Click edit button
  await getElementWithTimeout(By.id('EditIcon'))
    .then((btn) => btn.click());
  await wait(5000);

  // Fill name
  await getElementWithTimeout(By.id('edit-security-groups-name'))
    .then((field) => replaceTextFieldValue(field, name));
  await wait(5000);

  // check name filled correctly
  await getElementWithTimeout(By.id('edit-security-groups-name'))
    .then((elem) => expect(elem.getAttribute('value')).resolves.toBe(name));
  await wait(2000);

  // Fill description
  await getSubElementWithTimeout('id', 'edit-security-groups-description', 'textarea')
    .then((field) => replaceTextFieldValue(field, description));
  await wait(5000);

  await getSubElementWithTimeout('id', 'edit-security-groups-description', 'textarea')
    .then((elem) => expect(elem.getText()).resolves.toBe(description));
  await wait(2000);

  // Click close button
  await getElementWithTimeout(By.id('CloseIcon'))
    .then((btn) => btn.click());
}

/**
 * Tries to click on a Security Group with the given name.
 *
 * @param name The name of the Security Group to select.
 */
export async function selectSecurityGroups(name: string) {
  await navigateToSecurityGroups();
  await selectObject(name);
}

export async function navigateToSecurityGroupsHelperSelect(name: string, id = '') {
  navigateToSecurityGroups(id);
  selectSecurityGroups(name);
}
