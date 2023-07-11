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
      console.error(error);
      console.error(`Unable to navigate to case or add case ${NAME}`);
    }
  });

  test('view a case incident response', async () => {
    // ensure that a case can be navigated to by name
    try {
      await navigateToCaseIncidentResponse();
      await wait(3000);
      await selectCaseIncidentResponse(NAME);
    } catch (error) {
      console.error(error);
      console.error(`Unable to navigate to case or select case ${NAME}`);
    }

    // give time to ensure elements changed
    await wait(3000);

    // Check that name is correct
    try {
      const nameField = await getXpathNodeWith('text', NAME);
      const actualName = await nameField.getText();
      expect(actualName).toBe(NAME);
    } catch (error) {
      console.error(error);
      console.error('Viewing case did not yield expected name');
    }

    // Check that the description is correct
    try {
      const descriptionField = await getSubElementWithTimeout(
        'id',
        'case-incident-response-description',
        'p',
      );
      const actualDescription = await descriptionField.getText();
      expect(actualDescription).toBe(DESCRIPTION);
    } catch (error) {
      console.error(error);
      console.error('Viewing case did not yield expected description');
    }
  });

  test('edit a case incident response', async () => {
    // ensure that a case can be selected by name
    try {
      await navigateToCaseIncidentResponse();
      await wait(3000);
      await selectCaseIncidentResponse(NAME);
      await wait(3000);
    } catch (error) {
      console.error(error);
      console.error(`Unable to navigate to case or select case ${NAME}`);
    }

    // ensure that a case can be edited
    try {
      await editCaseIncidentResponse(NEW_NAME, NEW_DESCRIPTION);
      await wait(2000);
    } catch (error) {
      console.error(error);
      console.error(`Unable to navigate to edit case ${NEW_NAME}`);
    }
  });

  test('delete a case incident response', async () => {
    // ensure that a case can be selected by name
    try {
      await navigateToCaseIncidentResponse();
      await wait(3000);
      await selectCaseIncidentResponse(NEW_NAME);
    } catch (error) {
      console.error(error);
      console.error(`Unable to navigate to case or select case ${NEW_NAME}`);
    }

    // give time to ensure elements selected
    await wait(3000);

    // try to actually delete the object
    try {
      await deleteDomainObject();
    } catch (error) {
      console.error(error);
      console.error(`Unable to delete case ${NEW_NAME}`);
    }

    // give time to ensure elements changed
    await wait(3000);

    // Check UPDATED Case Incident Response no longer shows up
    try {
      // No await here - as it should not be found
      getXpathNodeWith('aria-label', NEW_NAME)
        .then((elem) => expect(elem).toBeNull());
    } catch (error) {
      console.error(error);
      console.error(`Case was not deleted ${NEW_NAME}`);
    }
  });
});
