import 'chromedriver';
import { By } from 'selenium-webdriver';
import DriverService from './common/driver_service';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
  getXpathNodeWith,
} from './common/action_service';
import {
  addAnalysesReport,
  navigateToAnalysesReport,
  selectAnalysesReport,
  editAnalysesReport,
} from './common/analyses_service';
import { deleteDomainObject } from './common/domain_object_service';
import { logIn_LocalStrategy } from './common/auth_service';

describe('Analyses Workflow', () => {
  const NAME = 'Test Analyses Report';
  const NEW_NAME = 'UPDATED Test Analyses Report';
  const DESCRIPTION = 'Test Analyses Report Description';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create an analyses report', async () => {
    await navigateToAnalysesReport();
    await addAnalysesReport(NAME, DESCRIPTION);
    await wait(5000);
    await selectAnalysesReport(NAME);
    // Check that name and description are correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'case-analyses-report-description',
      'p',
    );
    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

  test('view an analyses report', async () => {
    await navigateToAnalysesReport();
    await selectAnalysesReport(NAME);
    await wait(6000);
  });

  test('edit an analyses report', async () => {
    const NEW_DESCRIPTION = 'UPDATED Test Analysis Description';
    await editAnalysesReport(NEW_NAME, NEW_DESCRIPTION);
    await selectAnalysesReport(NEW_NAME);
    // Check that all fields are updated correctly
    const newNameField = await getXpathNodeWith('text', NEW_NAME);
    const newActualName = await newNameField.getText();
    expect(newActualName).toBe(NEW_NAME);
    const newDescriptionField = await getSubElementWithTimeout(
      'id',
      'case-analyses-report-description',
      'p',
    );
    const newActualDescription = await newDescriptionField.getText();
    expect(newActualDescription).toBe(NEW_DESCRIPTION);
  });

  test('delete an analyses report', async () => {
    await navigateToAnalysesReport();
    await selectAnalysesReport(NEW_NAME);
    await wait(5000);
    // Need to pass in delete button ID or ERROR: Variable "$id" of non-null type "ID!" must not be null.
    await deleteDomainObject('delete-report-button');
    await wait(5000);
    // Check Analyses Report no longer exists no longer shows up
    const t = async () => {
      await getElementWithTimeout(
        By.xpath(`//*[text()="${NEW_NAME}"]/ancestor::a`),
        4000,
      );
    };

    // RxJS instanceof TimeoutError expects TimeoutErrorImpl for some reason
    // await expect(t).rejects.toThrow(TimeoutError);
    await expect(t).rejects.toThrow();
  });
});
