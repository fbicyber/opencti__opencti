import { By } from 'selenium-webdriver';
import {
  clickFab,
  clickNonClickable,
  getElementWithTimeout,
  getXpathNodeWith,
} from './action_service';
import { CreateOptions, createDomainObject, goToObjectOverview, selectObject } from './domain_object_service';

/**
 * Navigates to a Position's page, or the Position list displayer.
 *
 * @param id Optional internal ID of the Position
 */
export async function navigateToPosition(id = '') {
  await goToObjectOverview('locations', 'positions', id);
}

/**
 * Assuming we are on the Positions list displayer, click the create
 * button and create a new Position.
 *
 * @param name The name of the Position to create.
 * @param description The description of the Position to create.
 * @param options Optional fields to be populated during object creation.
 */
export async function addPosition(name: string, description: string, options: CreateOptions) {
  const selectedValues = await createDomainObject('locations', 'positions', name, description, options);
  return selectedValues;
}

export async function addOrganization(name: string) {
  // Click add button
  await clickFab('Add');

  // Click second add button
  await clickFab('Add', false, 2);
  // Add minimum organization details
  const orgNameInput = await getElementWithTimeout(By.name('name'));
  await orgNameInput.sendKeys(name); // set name to the given value
  // Click create button
  const orgCreateBtn = await getXpathNodeWith('text', 'Create', { nodePath: '//button' });
  await orgCreateBtn.click();
}

export async function linkOrganization(name: string) {
  // Select organization
  const orgListItem = await getXpathNodeWith('text', name, { xpath: '/ancestor::div[@role="button"]' });
  await clickNonClickable(orgListItem);
  // Click continue button
  const continueBtn = await getXpathNodeWith('text', 'Continue', { nodePath: '//button' });
  await continueBtn.getTagName(); // Adds delay before clicking the Continue button
  await continueBtn.click();
  // Click create button
  const createBtn = await getXpathNodeWith('text', 'Create', { nodePath: '//button' });
  await createBtn.click();
}

// Position to Country
export async function addCountry(name: string) {
  // Click add button
  await clickFab('Add');
  const countryListItem = await getXpathNodeWith('text', name, { xpath: '/ancestor::div[@role="button"]' });
  await clickNonClickable(countryListItem);
  // click continue
  const countryContinueBtn = await getXpathNodeWith('text', 'Continue', { nodePath: '//button' });
  await countryContinueBtn.getTagName();
  await countryContinueBtn.click();
  // click create
  const createBtn = await getXpathNodeWith('text', 'Create', { nodePath: '//button' });
  await createBtn.click();
}

export async function linkCountry(name: string) {
  // clicks the country link
  const countryItem = await getXpathNodeWith('text', name, { xpath: '/ancestor::a//input[@type="checkbox"]' });
  await countryItem.getTagName();
  await clickNonClickable(countryItem);
}

/**
 * Tries to click on an Position with the given name.
 *
 * @param name The name of the Position to select.
 */
export async function selectPosition(name: string) {
  await navigateToPosition();
  await selectObject(name);
}
