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

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

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
    try {
      await navigateToTakedownReport();
      await addTakedownReport(NAME, DESCRIPTION);
      await wait(5000);
    } catch (error) {
      console.error(`Unable to create takedown report! ${error}`);
      fail(error);
    }
  });

  test('view an takedown report', async () => {
    try {
      // get the takedown report
      await selectTakedownReport(NAME);
      await wait(5000);

      // Check that name is correct
      await getXpathNodeWith('aria-label', NAME)
        .then((elem) => elem.getText())
        .then((val) => expect(val).toBe(NAME));

      // check description was set properly
      await getSubElementWithTimeout('id', 'case-takedown-report-description', 'p')
        .then((elem) => elem.getText())
        .then((val) => expect(val).toBe(DESCRIPTION));
    } catch (error) {
      console.error(`Unable to find correct takedown report ${error}`);
      fail(error);
    }
  });

  test('edit a takedown report', async () => {
    try {
      await selectTakedownReport(NAME);
      await wait(3000);
      await editTakedownReport(NEW_NAME, NEW_DESCRIPTION);
    } catch (error) {
      console.error('Unable to edit takedown report successfully');
      fail(error);
    }
  });

  // New test case here to Add an Attachment to the existing Object by NAME

  test('delete a takedown report', async () => {
    try {
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
    } catch (error) {
      console.error('Unable to delete takedown report');
      fail(error);
    }
  });
});
