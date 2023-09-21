import 'chromedriver';
import DriverService from './common/driver_service';
import {
  getXpathNodeWith,
  wait,
} from './common/action_service';
import {
  addAnalysesReport,
  navigateToAnalysesReport,
  selectAnalysesReport,
  editAnalysesReport,
} from './common/analyses_service';
import { deleteDomainObject } from './common/domain_object_service';
import { logIn_LocalStrategy } from './common/auth_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

describe('Analyses Workflow', () => {
  const NAME = 'Test Analyses Report';
  const NEW_NAME = 'UPDATED Test Analyses Report';
  const DESCRIPTION = 'Test Analyses Report Description';
  const NEW_DESCRIPTION = 'UPDATED Test Analysis Description';

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
  });

  test('view an analyses report', async () => {
    try {
      await navigateToAnalysesReport();
      await selectAnalysesReport(NAME);
      await wait(6000);

      // check the name
      await getXpathNodeWith('text', NAME)
        .then((elem) => elem.getText())
        .then((val) => expect(val).toBe(NAME));

      // check the description
      await getXpathNodeWith('text', DESCRIPTION)
        .then((elem) => elem.getText())
        .then((val) => expect(val).toBe(DESCRIPTION));
    } catch (error) {
      console.error('Unable to view created analyses report');
      throw error;
    }
  });

  test('edit an analyses report', async () => {
    await editAnalysesReport(NEW_NAME, NEW_DESCRIPTION);
    await selectAnalysesReport(NEW_NAME);
  });

  test('delete an analyses report', async () => {
    try {
      await navigateToAnalysesReport();
      // if the report can't be found then this will throw error properly
      expect(await selectAnalysesReport(NEW_NAME)).toBeUndefined();
      await wait(5000);

      // delete the report
      await deleteDomainObject('delete-report-button');
      await wait(5000);

      // Check Analyses Report no longer exists no longer shows up
      getXpathNodeWith('aria-label', NEW_NAME)
        .then((elem) => expect(elem).toBeNull());
    } catch (error) {
      console.error('Unable to delete the created analyses report');
      throw error;
    }
  });
});
