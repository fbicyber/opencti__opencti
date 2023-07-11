import 'chromedriver';
import { By } from 'selenium-webdriver';
import DriverService from './common/driver_service';
import {
  getSubElementWithTimeout,
  wait,
  getXpathNodeWith,
  getElementWithTimeout,
} from './common/action_service';
import {
  addSecurityGroups,
  navigateToSecurityGroups,
  selectSecurityGroups,
  editSecurityGroups,
} from './common/securitygroups_service';
import { logIn_LocalStrategy } from './common/auth_service';
import { deleteDomainObject } from './common/domain_object_service';

describe('Security Groups Workflow', () => {
  const NAME = 'Test Security Groups';
  const NEW_NAME = 'UPDATED Test Security Groups';
  const DESCRIPTION = 'Test Security Groups Description';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create a security group', async () => {
    await navigateToSecurityGroups();
    await addSecurityGroups(NAME, DESCRIPTION);
    await wait(5000);
    await selectSecurityGroups(NAME);
    await wait(3000);
    // Check that name and description are correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME.toUpperCase());
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'case-security-groups-description',
      'p',
    );
    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

  test('edit a security group', async () => {
    const NEW_DESCRIPTION = 'updated test security group description';
    await editSecurityGroups(NEW_NAME, NEW_DESCRIPTION);
    await selectSecurityGroups(NEW_NAME);
    await wait(3000);
    // Check that all fields are updated correctly
    const newNameField = await getXpathNodeWith('text', NEW_NAME);
    const newActualName = await newNameField.getText();
    expect(newActualName).toBe(NEW_NAME.toUpperCase());
    const newDescriptionField = await getSubElementWithTimeout(
      'id',
      'case-security-groups-description',
      'p',
    );
    const newActualDescription = await newDescriptionField.getText();
    expect(newActualDescription).toBe(NEW_DESCRIPTION);
  });

  test('delete a security group', async () => {
    await navigateToSecurityGroups();
    await selectSecurityGroups(NEW_NAME);
    await wait(3000);
    await deleteDomainObject();
    await wait(3000);
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
