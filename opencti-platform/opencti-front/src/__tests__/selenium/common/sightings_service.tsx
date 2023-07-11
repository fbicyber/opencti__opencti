import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
  selectRandomFromDropdown,
  getDropdownSelectorWithName,
  getXpathNodeWith,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/**
 * Navigates to the Sightings list displayer.
 *
 * @param id Optional internal ID of the entity
 */
export async function navigateToSightings(id = '?sortBy=created_at&orderAsc=false') {
  await goToObjectOverview('events', 'sightings', id);
}

/**
 * Assuming we are on the Sightings list displayer, click the create
 * button and create a new entity.
 *
 * @param firstDate The date the Sighting was first observed
 * @param lastDate The date the Sighting was last observed
 * @param description The description of the Sighting to create.
 */
export async function addSightings(firstDate: string, lastDate: string, description: string) {
  // Navigate to Indicators list displayer
  await goToObjectOverview('observations', 'indicators', '?sortBy=created_at&orderAsc=false');

  // Click Add Button on Indicator
  const addBtn = await getElementWithTimeout(By.id('add-indicators'));
  await addBtn.click();
  await wait(2000);

  // Fill Indicator name
  const nameField = await getElementWithTimeout(By.id('add-indicators-name'));
  // Sometimes fails to find name field fast enough.
  await wait(2000);
  await nameField.click();
  await wait(2000);
  await nameField.sendKeys('Test Indicator');

  // Fill Pattern Type
  await wait(2000);
  await selectRandomFromDropdown(getDropdownSelectorWithName('pattern_type'), ['eql']);
  await wait(2000);

  const patternField = await getElementWithTimeout(By.id('add-indicators-pattern'));
  await wait(2000);
  await patternField.click();
  await patternField.sendKeys('Test Indicator Pattern');

  // // Fill Observable Type
  await wait(2000);
  await selectRandomFromDropdown(getDropdownSelectorWithName('x_opencti_main_observable_type'));
  await wait(2000);

  // // Fill description
  // const descriptionIndicatorField = await getSubElementWithTimeout(
  //   'id',
  //   'add-indicators-description',
  //   'textarea',
  // );
  // await wait(2000);
  // await descriptionIndicatorField.click();
  // await wait(2000);
  // await descriptionIndicatorField.sendKeys('Test Indicator Description');

  // Click Create button for Indicator
  const createIndicatorBtn = await getElementWithTimeout(By.id('add-indicators-create'));
  await createIndicatorBtn.click();

  // Navigate to Test Indicator
  await goToObjectOverview('observations', 'indicators', '?sortBy=created_at&orderAsc=false');
  await selectObject('Test Indicator');

  // Navigate to Sightings from Indicator
  const sightingsTab = await getXpathNodeWith('text', 'Sightings', { nth: 2 });
  await sightingsTab.click();

  // Click Add Sightings Button
  const addSightingsBtn = await getElementWithTimeout(By.id('add-sightings'));
  await addSightingsBtn.click();
  await wait(2000);

  // Find admin to create Sighting
  const searchField = await getXpathNodeWith('text', 'keyword');
  // Sometimes fails to find name field fast enough.
  await wait(2000);
  await searchField.click();
  await searchField.sendKeys('admin');

  // Fill First Observed Date
  const firstDateField = await getElementWithTimeout(By.id('add-sightings-first-date'));
  await wait(1000);
  await firstDateField.click();
  await firstDateField.sendKeys(`${firstDate}`);

  // Fill First Observed Date
  const lastDateField = await getElementWithTimeout(By.id('add-sightings-last-date'));
  await wait(1000);
  await lastDateField.click();
  await lastDateField.sendKeys(`${lastDate}`);

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'add-sightings-description',
    'textarea',
  );
  await descriptionField.click();
  await descriptionField.sendKeys(description);

  // Click create button
  const createBtn = await getElementWithTimeout(By.id('add-sightings-create'));
  await createBtn.click();
}

/**
 * Tries to click on a Security Group with the given name.
 *
 * @param name The name of the Security Group to select.
 */
export async function selectSightings(name: string) {
  await navigateToSightings();
  await selectObject(name);
}

export async function navigateToSightingsHelperSelect(name: string, id = '') {
  navigateToSightings(id);
  selectSightings(name);
}
