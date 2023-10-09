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
  await getElementWithTimeout(By.id('add-analyses-report'))
    .then((btn) => (btn.click()));
  await wait(2000);

  // Fill name
  await getElementWithTimeout(By.id('add-analyses-report-name'))
    .then((field) => replaceTextFieldValue(field, name));
  await wait(2000);

  // check value was changed
  await getElementWithTimeout(By.id('add-analyses-report-name'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(val).toBe(name));

  // Fill Report Date
  const formattedDate = getDateTime();
  await getElementWithTimeout(By.id('add-analyses-report-date'))
    .then((field) => replaceTextFieldValue(field, formattedDate));
  await wait(2000);

  // Fill description
  await getSubElementWithTimeout('id', 'add-analyses-report-description', 'textarea')
    .then((field) => replaceTextFieldValue(field, description));
  await wait(2000);

  // check that description changed successfully
  await getSubElementWithTimeout('id', 'add-analyses-report-description', 'textarea')
    .then((elem) => elem.getText())
    .then((val) => expect(val).toBe(description));

  // Click create button
  await getElementWithTimeout(By.id('add-analyses-report-create'))
    .then((btn) => (btn.click()));
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

  await getElementWithTimeout(By.id('EditIcon'))
    .then((btn) => (btn.click()));

  // Fill name
  await getElementWithTimeout(By.id('edit-analyses-report-name'))
    .then((field) => replaceTextFieldValue(field, name));
  await wait(2000);

  // check value was changed
  await getElementWithTimeout(By.id('edit-analyses-report-name'))
    .then((elem) => elem.getAttribute('value'))
    .then((val) => expect(val).toBe(name));

  // Fill Report Date
  const formattedDate = getDateTime();
  await getElementWithTimeout(By.id('edit-analyses-report-date'))
    .then((field) => replaceTextFieldValue(field, formattedDate));
  await wait(2000);

  // Fill description
  await getSubElementWithTimeout('id', 'edit-analyses-report-description', 'textarea')
    .then((field) => replaceTextFieldValue(field, description));
  await wait(2000);

  // check the description
  await getSubElementWithTimeout('id', 'edit-analyses-report-description', 'textarea')
    .then((elem) => elem.getText())
    .then((val) => expect(val).toBe(description));

  // Click close button
  await getElementWithTimeout(By.id('CloseIcon'))
    .then((btn) => (btn.click()));
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
