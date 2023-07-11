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

describe('Feedback Workflow', () => {
  const NAME = 'Feedback from admin@opencti.io';
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
    await navigateToCaseFeedback();
    await wait(2000);
    await pressProfileButton();
    await wait(2000);
    await addCaseFeedbackResponse(DESCRIPTION);
    await wait(5000);
    await selectCaseFeedbackResponse(NAME);
    await wait(2000);
    // Check that name and description are correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);
    await wait(1000);
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'case-feedback-response-description',
      'p',
    );
    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

  test('view feedback response', async () => {
    await selectCaseFeedbackResponse(NAME);
    await wait(3000);
    await navigateToCaseFeedback();
  });

  test('edit feedback response', async () => {
    await navigateToCaseFeedback();
    await wait(2000);
    await selectCaseFeedbackResponse(NAME);
    await wait(2000);
    await editCaseFeedbackResponse(NEW_DESCRIPTION);
    await wait(2000);
    await navigateToCaseFeedback();
    await wait(2000);
    await selectCaseFeedbackResponse(NAME);
    await wait(2000);

    const UpdatedDescriptionField = await getSubElementWithTimeout(
      'id',
      'case-feedback-response-description',
      'p',
    );
    const actualDescription2 = await UpdatedDescriptionField.getText();
    expect(actualDescription2).toBe(NEW_DESCRIPTION);
    await wait(2000);
  });

  test('delete feedback response', async () => {
    await navigateToCaseFeedback();
    await selectCaseFeedbackResponse(NAME);
    await wait(3000);
    await deleteDomainObject();
    await wait(3000);

    // Check Feedback no longer shows up
    const t = async () => {
      await getElementWithTimeout(
        By.xpath(`//*[text()="${NAME}"]/ancestor::a`),
        2000,
      );
    };
    // RxJS instanceof TimeoutError expects TimeoutErrorImpl for some reason
    // await expect(t).rejects.toThrow(TimeoutError);
    await expect(t).rejects.toThrow();
  });
});
