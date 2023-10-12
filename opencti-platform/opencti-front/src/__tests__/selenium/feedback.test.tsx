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
  addCaseFeedbackResponse,
  navigateToCaseFeedback,
  selectCaseFeedbackResponse,
  pressProfileButton,
  editCaseFeedbackResponse,
} from './common/feedback_service';
import { logIn_LocalStrategy } from './common/auth_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

describe('Feedback Workflow', () => {
  const NAME = 'Feedback from admin@opencti.io';
  const NEW_NAME = 'Updated feedback from admin@opencti.io';
  const DESCRIPTION = 'Test Case Feedback Response Description';
  const NEW_DESCRIPTION = 'UPDATED Test Case Feedback Response Description';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create feedback response', async () => {
    try {
      await navigateToCaseFeedback();
      await wait(2000);
      await pressProfileButton();
      await wait(2000);
      await addCaseFeedbackResponse(DESCRIPTION);
      await wait(5000);
    } catch (error) {
      console.error('Unable to create feedback response');
      throw error;
    }
  });

  test('view feedback response', async () => {
    try {
      await selectCaseFeedbackResponse(NAME);
      await wait(3000);

      // check name is correct
      await getXpathNodeWith('text', NAME)
        .then((elem) => elem.getText())
        .then((val) => expect(val).toBe(NAME));

      // check that description is correct
      await getSubElementWithTimeout('id', 'case-feedback-response-description', 'p')
        .then((elem) => elem.getText())
        .then((val) => expect(val).toBe(DESCRIPTION));
    } catch (error) {
      console.error('Unable to edit feedback response');
      throw error;
    }
  });

  test('edit feedback response', async () => {
    try {
      await selectCaseFeedbackResponse(NAME);
      await editCaseFeedbackResponse(NEW_NAME, NEW_DESCRIPTION);
    } catch (error) {
      console.error('Unable to edit feedback response');
      throw error;
    }
  });

  test('delete feedback response', async () => {
    try {
      await selectCaseFeedbackResponse(NEW_NAME);
      await wait(3000);

      // delete the case report
      await deleteDomainObject();
      await wait(5000);

      // need to refresh to ensure feedback updates
      await navigateToCaseFeedback();

      // Check Feedback no longer shows up
      const t = async () => {
        await getElementWithTimeout(
          By.xpath(`//*[text()="${NAME}"]/ancestor::a`),
          2000,
        );
      };
      // RxJS instanceof TimeoutError expects TimeoutErrorImpl for some reason
      await expect(t).rejects.toThrow();
    } catch (error) {
      console.error('Feedback was not deleted! Or a second one existed');
      throw error;
    }
  });
});
