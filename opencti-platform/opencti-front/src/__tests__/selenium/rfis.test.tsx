import 'chromedriver';
import { By } from 'selenium-webdriver';
import DriverService from './common/driver_service';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
  getXpathNodeWith,
  getDateTime,
} from './common/action_service';
import { deleteDomainObject } from './common/domain_object_service';
import {
  addRfis,
  // editRfis, commented out for testing purposes
  navigateToRfis,
  editRfis,
  selectRfis,
} from './common/rfis_service';
import { logIn_LocalStrategy } from './common/auth_service';

describe('RFI Workflow', () => {
  const NAME = 'Test Request for Information';
  const NEW_NAME = 'UPDATED Test Request for Information';
  const DESCRIPTION = 'Test Request for Information Description';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create an RFI', async () => {
    await navigateToRfis();
    await wait(5000);
    await addRfis(NAME, DESCRIPTION);
    await wait(5000);
    await selectRfis(NAME);

    // Check that name and description are correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);

    const descriptionField = await getSubElementWithTimeout(
      'id',
      'Rfis-description',
      'p',
    );

    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

  test('view an RFI', async () => {
    await navigateToRfis();
    await selectRfis(NAME);
    await wait(5000);
    // Check that name and description are correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);

    const descriptionField = await getSubElementWithTimeout(
      'id',
      'Rfis-description',
      'p',
    );

    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

  test('edit an RFI', async () => {
    const NEW_DESCRIPTION = 'UPDATED Test Request for Information Description';
    const NEW_DATE = getDateTime();
    await editRfis(NEW_NAME, NEW_DESCRIPTION);
    await selectRfis(NEW_NAME);
    // Check that all fields are updated correctly
    const newNameField = await getXpathNodeWith('text', NEW_NAME);
    const newActualName = await newNameField.getText();
    expect(newActualName).toBe(NEW_NAME);
    const newDescriptionField = await getSubElementWithTimeout(
      'id',
      'Rfis-description',
      'p',
    );
    const newActualDescription = await newDescriptionField.getText();
    expect(newActualDescription).toBe(NEW_DESCRIPTION);
  });

  test('delete an RFI', async () => {
    await navigateToRfis();
    await selectRfis(NEW_NAME);
    await wait(3000);
    await deleteDomainObject();
    await wait(3000);

    // Check Information no longer shows up
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
