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
  addIndividual,
  navigateToIndividual,
  selectIndividual,
} from './common/individual_service';
import { logIn_LocalStrategy } from './common/auth_service';

describe('Individual workflow', () => {
  const NAME = 'Test Individual';
  const DESCRIPTION = 'Test Individual Description';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create an individual', async () => {
    await navigateToIndividual();
    await addIndividual(NAME, DESCRIPTION);
    await selectIndividual(NAME);

    // Check that name and description are correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);

    const descriptionField = await getSubElementWithTimeout(
      'id',
      'individual-description',
      'p',
    );
    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

  test('delete an individual', async () => {
    await navigateToIndividual();
    await selectIndividual(NAME);

    await wait(10000);

    await deleteDomainObject();

    // Check Individual no longer shows up
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
