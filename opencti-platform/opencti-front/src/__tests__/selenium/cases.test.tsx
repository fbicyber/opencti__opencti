import 'chromedriver';
import DriverService from './common/driver_service';
import {
  getSubElementWithTimeout,
  wait,
  getXpathNodeWith,
} from './common/action_service';
import { deleteDomainObject } from './common/domain_object_service';
import {
  addCaseIncidentResponse,
  navigateToCaseIncidentResponse,
  selectCaseIncidentResponse,
  editCaseIncidentResponse,
} from './common/case_service';
import { logIn_LocalStrategy } from './common/auth_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

describe('Case Incident Response Workflow', () => {
  const NAME = 'Test Case Incident Response';
  const NEW_NAME = 'UPDATED Test Case Incident';
  const DESCRIPTION = 'Test Case Incident Response Description';
  const NEW_DESCRIPTION = 'UPDATED Test Case Incident Response Description';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create a case incident response', async () => {
    // ensure that new case can be created
    try {
      await navigateToCaseIncidentResponse();
      await wait(3000);
      await addCaseIncidentResponse(NAME, DESCRIPTION);
    } catch (error) {
      console.error(`Unable to navigate to case or add case ${NAME}`);
      throw error;
    }
  });

  test('view a case incident response', async () => {
    try {
      await selectCaseIncidentResponse(NAME);

      // Check that name is correct
      await getXpathNodeWith('text', NAME)
        .then((elem) => elem.getText())
        .then((val) => expect(val).toBe(NAME));

      // Check that description is correct
      await getSubElementWithTimeout('id', 'case-incident-response-description', 'p')
        .then((elem) => elem.getText())
        .then((val) => expect(val).toBe(DESCRIPTION));
    } catch (error) {
      console.error('Viewing case did not yield expected description');
      throw error;
    }
  });

  test('edit a case incident response', async () => {
    // ensure that a case can be selected by name
    try {
      await selectCaseIncidentResponse(NAME);
      await editCaseIncidentResponse(NEW_NAME, NEW_DESCRIPTION);
      await wait(2000);
    } catch (error) {
      console.error(`Unable to navigate to edit case ${NEW_NAME}`);
      throw error;
    }
  });

  test('delete a case incident response', async () => {
    // ensure that a case can be selected by name
    try {
      await selectCaseIncidentResponse(NEW_NAME);
      await wait(3000);

      await deleteDomainObject();
      await wait(3000);

      getXpathNodeWith('aria-label', NEW_NAME)
        .then((elem) => expect(elem).toBeNull());
    } catch (error) {
      console.error(`Case was not deleted ${NEW_NAME}`);
      throw error;
    }
  });
});
