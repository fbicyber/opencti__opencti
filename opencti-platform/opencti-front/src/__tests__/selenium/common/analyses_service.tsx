import { By } from 'selenium-webdriver';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
  getDateTime,
  replaceTextFieldValue,
} from './action_service';
import { goToObjectOverview, selectObject } from './domain_object_service';

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
  const addBtn = await getElementWithTimeout(By.id('add-analyses-report'));
  await addBtn.click();
  await wait(2000);

  // Fill name
  const nameField = await getElementWithTimeout(By.id('add-analyses-report-name'));
  // Sometimes fails to find name field fast enough.
  await wait(2000);
  await nameField.click();
  await nameField.sendKeys(name);

  // Fill Report Date
  const reportDate = await getElementWithTimeout(By.id('add-analyses-report-date'));
  await wait(1000);
  await reportDate.click();
  const formattedDate = getDateTime();
  await replaceTextFieldValue(reportDate, formattedDate);
  await wait(1000);

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'add-analyses-report-description',
    'textarea',
  );
  await descriptionField.click();
  await descriptionField.sendKeys(description);

  // Click create button
  const createBtn = await getElementWithTimeout(By.id('add-analyses-report-create'));
  await createBtn.click();
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
  const editBtn = await getElementWithTimeout(By.id('EditIcon'));
  await editBtn.click();

  // Fill name
  const nameField = await getElementWithTimeout(By.id('edit-analyses-report-name'));
  // Sometimes fails to find name field fast enough.
  await wait(1000);
  await nameField.click();
  await wait(1000);
  await replaceTextFieldValue(nameField, name);
  await wait(1000);

  // Fill Report Date
  const reportDate = await getElementWithTimeout(By.id('edit-analyses-report-date'));
  await wait(1000);
  await reportDate.click();
  await wait(1000);
  const formattedDate = getDateTime();
  await replaceTextFieldValue(reportDate, formattedDate);
  await wait(1000);

  // Fill description
  const descriptionField = await getSubElementWithTimeout(
    'id',
    'edit-analyses-report-description',
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
