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
  addRfis,
  navigateToRfis,
  editRfis,
  selectRfis,
} from './common/rfis_service';
import { logIn_LocalStrategy } from './common/auth_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

describe('RFI Workflow', () => {
  const NAME = 'Test Request for Information';
  const NEW_NAME = 'UPDATED Test Request for Information';
  const DESCRIPTION = 'Test Request for Information Description';
  const NEW_DESCRIPTION = 'Test Request for Information Description';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create an RFI', async () => {
    try {
      await navigateToRfis();
      await wait(3000);
      await addRfis(NAME, DESCRIPTION);
      await wait(3000);
    } catch (error) {
      console.error('Failed to case request for information');
      throw error;
    }
  });

  test('view an RFI', async () => {
    try {
      // navigate and select correct case RFI
      await selectRfis(NAME);
      await wait(5000);

      // check name was set correctly
      await getXpathNodeWith('aria-label', NAME)
        .then((elem) => elem.getText())
        .then((val) => expect(val).toBe(NAME));

      // check description was set correctly
      await getSubElementWithTimeout('id', 'Rfis-description', 'p')
        .then((elem) => elem.getText())
        .then((val) => expect(val).toBe(DESCRIPTION));
    } catch (error) {
      console.error('Unable find correct request for information');
      throw error;
    }
  });

  test('edit an RFI', async () => {
    try {
      // navigate and select correct case RFI
      await selectRfis(NAME);

      // edit the case RFI
      await editRfis(NEW_NAME, NEW_DESCRIPTION);
      await wait(5000);
    } catch (error) {
      console.error('Failed to edit case request for information');
      throw error;
    }
  });

  test('delete an RFI', async () => {
    try {
      // navigate and select correct case RFI
      await navigateToRfis();
      await selectRfis(NEW_NAME);
      await wait(3000);

      // delete the case RFI
      await deleteDomainObject();
      await wait(3000);

      // Check RFI was deleted
      const t = async () => {
        await getElementWithTimeout(
          By.xpath(`//*[text()="${NEW_NAME}"]/ancestor::a`),
          2000,
        );
      };

      // RxJS instanceof TimeoutError expects TimeoutErrorImpl for some reason
      await expect(t).rejects.toThrow();
    } catch (error) {
      console.error('Unable validate correct request for information was deleted');
      throw error;
    }
  });
});
