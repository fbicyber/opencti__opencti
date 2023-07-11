import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/**
 * Navigates to an Individual's page, or the Individuals list displayer.
 *
 * @param id Optional internal ID of the Individual
 */
export async function navigateToIndividual(id = '') {
  await goToObjectOverview('entities', 'individuals', id);
}

/**
 * Assuming we are on the Individuals list displayer, click the create
 * button and create a new Individual.
 *
 * @param name The name of the Individual to create.
 * @param description The description of the Individual to create.
 */
export async function addIndividual(name: string, description: string) {
  // Click add button
  const addBtn = await getElementWithTimeout(By.id('add-individual'));
  await addBtn.click();

  // Fill name
  const nameField = await getElementWithTimeout(By.id('add-individual-name'));
  // Sometimes fails to find name field fast enough.
  await wait(1000);
  await nameField.click();
  await nameField.sendKeys(name);

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'add-individual-description',
    'textarea',
  );
  await descriptionField.click();
  await descriptionField.sendKeys(description);

  // Click create button
  const createBtn = await getElementWithTimeout(By.id('add-individual-create'));
  await createBtn.click();
}
/**
 * Navigates to click the individual edit button
 * @param id
 */
export async function navigateToIndividualEdit() {
  const addBtn = await getElementWithTimeout(By.id('EditIcon'));
  await addBtn.click();
}

/**
 * Clicks to eye field
 * @param id
 */
export async function navigateToIndividualEditEye() {
  const addBtn = await getElementWithTimeout(By.id('mui-component-select-x_mcas_eye_color'));
  await wait(1000);
  await addBtn.click();
  const optionBlack = await getElementWithTimeout(By.id('eye-color-black'));
  await optionBlack.getTagName();
  await optionBlack.click();
}

export async function navigateToIndividualEditHair() {
  const addBtn = await getElementWithTimeout(By.id('mui-component-select-x_mcas_hair_color'));
  await wait(1000);
  await addBtn.click();
  const optionBlack = await getElementWithTimeout(By.id('hair-color-red'));
  await optionBlack.click();
}
export async function navigateToIndividualEditHeightDate() {
  const addBtn = await getElementWithTimeout(By.id('addHeight'));
  await wait(1000);
  await addBtn.click();
  const add_date = await getElementWithTimeout(By.id('height_0'));
  await add_date.click();
  const addheightDate = await getElementWithTimeout(By.id('height_date_0'));
  addheightDate.sendKeys('202301011200A');
}

export async function navigateToIndividualEditHeight() {
  const addBtn = await getElementWithTimeout(By.id('addHeight'));
  await wait(1000);
  await addBtn.click();
  const addheight0 = await getElementWithTimeout(By.id('height_0'));
  await addheight0.click();
  addheight0.sendKeys('70');
  await addheight0.click();
  const addheightDate = await getElementWithTimeout(By.id('height_date_0'));
  addheightDate.sendKeys('202301011200A');
  await addheightDate.click();
  await addheight0.click();
}

export async function navigateToIndividualEditWeight() {
  const addBtn = await getElementWithTimeout(By.id('addWeight'));
  await wait(1000);
  await addBtn.click();
  const addweight0 = await getElementWithTimeout(By.id('weight_0'));
  await addweight0.click();
  addweight0.sendKeys('150');
  await wait(250);
  await addweight0.click();
  const addweightDate = await getElementWithTimeout(By.id('weight_date_0'));
  addweightDate.sendKeys('202301011200A');
  await addweightDate.click();
  await addweight0.click();
}

/**
 * Tries to click on an Individual with the given name.
 *
 * @param name The name of the Individual to select.
 */
export async function selectIndividual(name: string) {
  await navigateToIndividual();
  await selectObject(name);
}

export async function navigateToIndividualHelperSelect(name: string, id = '') {
  navigateToIndividual(id);
  selectIndividual(name);
}

/**
 * Assuming on Individual overview, click edit
 * Changes made to the individual info
 */
export async function editIndividual() {
  // const driver: WebDriver = await new DriverService().driver;
  // await driver.get(`${BASE_URL}dashboard/entities/individuals/?`);
  // await driver.get()
}
