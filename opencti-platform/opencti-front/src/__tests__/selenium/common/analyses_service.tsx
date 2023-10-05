import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
  getDateTime,
  replaceTextFieldValue,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

/**
 * Navigates to the Analyses Report list displayer.
 *
 * @param id Optional internal ID of the Analyses Object
 */
export async function navigateToAnalysesReport(id = '?sortBy=published&orderAsc=false') {
  await goToObjectOverview('analyses', 'reports', id);
}

/**
 * Assuming we are on the Analyses Report list displayer, click the create
 * button and create a new Analyses Report.
 *
 * @param name The name of the Analyses Report to create.
 * @param description The description of the Analyses Report to create.
 */
export async function addAnalysesReport(name: string, description: string) {
  // Click add button
  try {
    const addBtn = await getElementWithTimeout(By.id('add-analyses-report'));
    await addBtn.click();
    await wait(2000);
  } catch (error) {
    console.error('Unable to create analyses report');
    throw error;
  }

  // Fill name
  try {
    const nameField = await getElementWithTimeout(By.id('add-analyses-report-name'), 4000);
    await nameField.click();
    await nameField.sendKeys(name);
    await wait(1000);

    // check value was changed
    await getElementWithTimeout(By.id('add-analyses-report-name'), 4000)
      .then((elem) => elem.getText())
      .then((val) => console.error(val));
  } catch (error) {
    console.error('Unable to interact with analyses report name field');
    throw error;
  }

  // Fill Report Date
  try {
    const reportDate = await getElementWithTimeout(By.id('add-analyses-report-date'), 3000);
    await reportDate.click();

    // TODO: replace prepopulated datetime with current datetime
    const formattedDate = getDateTime();
    await replaceTextFieldValue(reportDate, formattedDate);
    await wait(1000);
  } catch (error) {
    console.error('Unable to interact with analyses report date');
    throw error;
  }

  // Fill description
  try {
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'add-analyses-report-description',
      'textarea',
    );

    // change the description
    await descriptionField.click();
    await descriptionField.sendKeys(description);

    // check that description changed successfully
    await getSubElementWithTimeout('id', 'add-analyses-report-description', 'textarea')
      .then((elem) => elem.getText())
      .then((val) => expect(val).toBe(description));
  } catch (error) {
    console.error('Unable to interact with analyses report description');
    throw error;
  }

  // Click create button
  try {
    const createBtn = await getElementWithTimeout(By.id('add-analyses-report-create'));
    await createBtn.click();
  } catch (error) {
    console.error('Unable to create analyses report');
    throw error;
  }
}
/**
 * Tries to click on a Case Analyses Report with the given name.
 *
 * @param name The new Case Analyses Report name
 * @param description The new Case Analyses Report description
 * @param date The new string representation of the created/edit dated of the report
 */
export async function editAnalysesReport(name: string, description: string) {
  // Click edit button
  try {
    const editBtn = await getElementWithTimeout(By.id('EditIcon'));
    await editBtn.click();
  } catch (error) {
    console.error('Unable to interact with edit analyses report');
    throw error;
  }

  // Fill name
  try {
    const nameField = await getElementWithTimeout(By.id('edit-analyses-report-name'), 3000);
    await nameField.click();
    await wait(1000);

    // change the value
    await replaceTextFieldValue(nameField, name);
    await wait(1000);

    // check value was changed
    await getElementWithTimeout(By.id('edit-analyses-report-name'), 3000)
      .then((elem) => elem.getText())
      .then((val) => console.error(val));
  } catch (error) {
    console.error('Unable to interact with edit analyses report name');
    throw error;
  }

  // Fill Report Date
  try {
    const reportDate = await getElementWithTimeout(By.id('edit-analyses-report-date'), 3000);
    await reportDate.click();
    await wait(1000);

    // TODO: replace prepopulated date with current time
    const formattedDate = getDateTime();
    await replaceTextFieldValue(reportDate, formattedDate);
    await wait(1000);
  } catch (error) {
    console.error('Unable to interact with edit analyses report date');
    throw error;
  }

  // Fill description
  try {
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'edit-analyses-report-description',
      'textarea',
    );
    await descriptionField.click();
    await wait(1000);

    // replace the description
    await replaceTextFieldValue(descriptionField, description);
    await wait(1000);

    // check the description
    await getSubElementWithTimeout('id', 'edit-analyses-report-description', 'textarea')
      .then((elem) => elem.getText())
      .then((val) => expect(val).toBe(description));
  } catch (error) {
    console.error('Unable to interact with edit analyses report description');
    throw error;
  }

  // Click close button
  try {
    const closeBtn = await getElementWithTimeout(By.id('CloseIcon'));
    await closeBtn.click();
  } catch (error) {
    console.error('Unable to edit analyses report');
    throw error;
  }
}

/**
 * Tries to click on a Case Analyses Report with the given name.
 *
 * @param name The name of the Case Analyses Report to select.
 */
export async function selectAnalysesReport(name: string) {
  await navigateToAnalysesReport();
  await selectObject(name);
}

export async function navigateToAnalysisReportHelperSelect(name: string, id = '') {
  navigateToAnalysesReport(id);
  selectAnalysesReport(name);
}
