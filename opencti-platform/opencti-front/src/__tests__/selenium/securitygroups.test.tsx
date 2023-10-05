import 'chromedriver';
import { By } from 'selenium-webdriver';
import DriverService from './common/driver_service';
import {
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

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

describe('Security Groups Workflow', () => {
  const NAME = 'Test Security Groups';
  const NEW_NAME = 'UPDATED Test Security Groups';
  const DESCRIPTION = 'Test Security Groups Description';
  const NEW_DESCRIPTION = 'updated test security group description';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create a security group', async () => {
    try {
      await navigateToSecurityGroups();
      await addSecurityGroups(NAME, DESCRIPTION);
      await wait(5000);
    } catch (error) {
      console.error('Unable to create new security group.');
      fail(error);
    }
  });

  test('view a security group', async () => {
    try {
      await selectSecurityGroups(NAME);
      await wait(2000);

      // check name filled correctly
      await getXpathNodeWith('text', NAME)
        .then((elem) => expect(elem.getText()).resolves.toBe(NAME.toUpperCase())); // this is because name gets capslocked

      // check the description was set correctly
      await getXpathNodeWith('text', DESCRIPTION)
        .then((elem) => expect(elem.getText()).resolves.toBe(DESCRIPTION)); // this is because name gets capslocked
    } catch (error) {
      console.error('Unable to view created security group.');
      fail(error);
    }
  });

  test('edit a security group', async () => {
    try {
      await selectSecurityGroups(NAME);
      await editSecurityGroups(NEW_NAME, NEW_DESCRIPTION);
      await wait(3000);
    } catch (error) {
      console.error('Unable to edit security group.');
      fail(error);
    }
  });

  test('delete a security group', async () => {
    try {
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
      await expect(t).rejects.toThrow();
    } catch (error) {
      console.error('Unable to delete security group.');
      fail(error);
    }
  });
});
