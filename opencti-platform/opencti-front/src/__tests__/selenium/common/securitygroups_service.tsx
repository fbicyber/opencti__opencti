import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
  replaceTextFieldValue,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

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
  const addBtn = await getElementWithTimeout(By.id('add-security-groups'));
  await addBtn.click();
  await wait(2000);

  // Fill name
  const nameField = await getElementWithTimeout(By.id('add-security-groups-name'));
  // Sometimes fails to find name field fast enough.
  await wait(2000);
  await nameField.click();
  await nameField.sendKeys(name);
  await wait(2000);

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'add-security-groups-description',
    'textarea',
  );
  await descriptionField.click();
  await wait(2000);
  await descriptionField.sendKeys(description);
  await wait(2000);

  // Click create button
  const createBtn = await getElementWithTimeout(By.id('add-security-groups-create'));
  await createBtn.click();
}
/**
 * Tries to edit a Security Group with the given name.
 *
 * @param name The new Security Group name
 * @param description The new Security Group description
 */
export async function editSecurityGroups(name: string, description: string) {
  // Click edit button
  const editBtn = await getElementWithTimeout(By.id('EditIcon'));
  await editBtn.click();
  await wait(2000);

  // Fill name
  const nameField = await getElementWithTimeout(By.id('edit-security-groups-name'));
  // Sometimes fails to find name field fast enough.
  await wait(1000);
  await nameField.click();
  await wait(2000);
  await replaceTextFieldValue(nameField, name);
  await wait(2000);

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'edit-security-groups-description',
    'textarea',
  );
  await descriptionField.click();
  await wait(1000);
  await replaceTextFieldValue(descriptionField, description);
  await wait(1000);

  // Click close button
  const closeBtn = await getElementWithTimeout(By.id('CloseIcon'));
  await closeBtn.click();
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
