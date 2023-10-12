import 'chromedriver';
import { By } from 'selenium-webdriver';
import DriverService from './common/driver_service';
import {
  wait,
  getDateTime,
  getXpathNodeWith,
  getElementWithTimeout,
} from './common/action_service';
import {
  addEventObservedData,
  navigateToEventObservedData,
  selectEventObservedData,
  editEventObservedData,
} from './common/observedData_service';
import { deleteDomainObject } from './common/domain_object_service';
import { logIn_LocalStrategy } from './common/auth_service';

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

describe('Event Observed Data Workflow', () => {
  const FIRST_DATE = getDateTime();
  const LAST_DATE = getDateTime();
  const NEW_FIRST_DATE = getDateTime();
  const NEW_LAST_DATE = getDateTime();
  let ENTITY = '';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create an event observed data', async () => {
    try {
      await navigateToEventObservedData();
      ENTITY = await addEventObservedData(FIRST_DATE, LAST_DATE);
      await wait(5000);
    } catch (error) {
      console.error('Unable to create event observed data');
      throw error;
    }
  });

  test('view an event observed data', async () => {
    try {
      await wait(3000);
      await selectEventObservedData(ENTITY);
      await wait(3000);

      // Check that entity is the same
      await getXpathNodeWith('text', ENTITY)
        .then((elem) => elem.getText())
        .then((val) => expect(val).toBe(ENTITY));
    } catch (error) {
      console.error('Unable to view event observed data');
      throw error;
    }
  });

  test('edit an event observed data', async () => {
    try {
      await selectEventObservedData(ENTITY);
      await wait(3000);
      await editEventObservedData(NEW_FIRST_DATE, NEW_LAST_DATE);
    } catch (error) {
      console.error('Unable to edit event observed data');
      throw error;
    }
  });

  test('delete an event observed data', async () => {
    try {
      await selectEventObservedData(ENTITY);
      await wait(3000);

      await deleteDomainObject('delete-observable-button');
      await wait(3000);

      await navigateToEventObservedData();
      // Check Observed Data no longer shows up
      const t = async () => {
        await getElementWithTimeout(
          By.xpath(`//*[text()="${ENTITY}"]/ancestor::a`),
          2000,
        );
      };
      // RxJS instanceof TimeoutError expects TimeoutErrorImpl for some reason
      await expect(t).rejects.toThrow();
    } catch (error) {
      console.error('Unable to delete event observed data');
      throw error;
    }
  });
});
