import 'chromedriver';
import { By } from 'selenium-webdriver';
import DriverService from './common/driver_service';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
  getXpathNodeWith,
} from './common/action_service';
import { deleteDomainObject } from './common/domain_object_service';
import {
  addTakedownReport,
  editTakedownReport,
  navigateToTakedownReport,
  selectTakedownReport,
} from './common/rfts_service';
import { logIn_LocalStrategy } from './common/auth_service';

describe('Takedown Workflow', () => {
  const NAME = 'Test Case Takedown Report';
  const DESCRIPTION = 'Test Case Takedown Report Description';
  const NEW_NAME = 'UPDATED Test Case Takedown Report';
  const NEW_DESCRIPTION = 'UPDATED Test Case Takedown Report Description';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create a takedown report', async () => {
    await navigateToTakedownReport();
    await addTakedownReport(NAME, DESCRIPTION);
    await wait(5000);
    await selectTakedownReport(NAME);
    // Check that name and description are correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'case-takedown-report-description',
      'p',
    );
    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

  test('view an takedown report', async () => {
    await navigateToTakedownReport();
    await selectTakedownReport(NAME);
    await wait(5000);
    // Check that name and description are correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'case-takedown-report-description',
      'p',
    );
    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

  // New test case function to Edit the esisiting object looked up by NAME
  test('edit a takedown report', async () => {
    await navigateToTakedownReport();
    await selectTakedownReport(NAME);
    await wait(3000);
    await editTakedownReport(NEW_NAME, NEW_DESCRIPTION);
    // Check that all fields are updated correctly
    const newNameField = await getXpathNodeWith('text', NEW_NAME);
    const newActualName = await newNameField.getText();
    expect(newActualName).toBe(NEW_NAME);
    const new_descriptionField = await getSubElementWithTimeout(
      'id',
      'case-takedown-report-description',
      'p',
    );
    const actualDescription2 = await new_descriptionField.getText();
    expect(actualDescription2).toBe(NEW_DESCRIPTION);
  });

  // New test case here to Add an Attachment to the existing Object by NAME

  test('delete a takedown report', async () => {
    await navigateToTakedownReport();
    await selectTakedownReport(NEW_NAME);

    await wait(3000);

    await deleteDomainObject();

    // Check Case Incident Response no longer shows up
    const t = async () => {
      await getElementWithTimeout(
        By.xpath(`//*[text()="${NEW_NAME}"]/ancestor::a`),
        2000,
      );
    };
    // RxJS instanceof TimeoutError expects TimeoutErrorImpl for some reason
    // await expect(t).rejects.toThrow(TimeoutError);
    await expect(t).rejects.toThrow();
  });
});
