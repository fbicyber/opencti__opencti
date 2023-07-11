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

describe('Event Observed Data Workflow', () => {
  const FIRST_DATE = getDateTime();
  const LAST_DATE = getDateTime();
  let ENTITY = '';
  const NEW_FIRST_DATE = getDateTime();
  const NEW_LAST_DATE = getDateTime();

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create an event observed data', async () => {
    await navigateToEventObservedData();
    ENTITY = await addEventObservedData(FIRST_DATE, LAST_DATE);
    await wait(5000);
    await selectEventObservedData(ENTITY);
    // Check that entity is the same
    const entityField = await getXpathNodeWith('text', ENTITY);
    const actualEntity = await entityField.getText();
    expect(actualEntity).toBe(ENTITY);
  });

  test('view an event observed data', async () => {
    await navigateToEventObservedData();
    await selectEventObservedData(ENTITY);
    await wait(3000);
    // Check that entity is the same
    const entityField = await getXpathNodeWith('text', ENTITY);
    const actualEntity = await entityField.getText();
    expect(actualEntity).toBe(ENTITY);
  });

  test('edit an event observed data', async () => {
    await editEventObservedData(NEW_FIRST_DATE, NEW_LAST_DATE);
    await selectEventObservedData(ENTITY);
    // Check that entity is the same
    const entityField = await getXpathNodeWith('text', ENTITY);
    const actualEntity = await entityField.getText();
    expect(actualEntity).toBe(ENTITY);
  });

  test('delete an event observed data', async () => {
    await navigateToEventObservedData();
    await selectEventObservedData(ENTITY);
    await wait(3000);
    // Need to pass in delete button ID or ERROR: Variable "$id" of non-null type "ID!" must not be null.
    await deleteDomainObject('delete-observable-button');
    await wait(3000);
    // Check Observed Data no longer shows up
    const t = async () => {
      await getElementWithTimeout(
        By.xpath(`//*[text()="${ENTITY}"]/ancestor::a`),
        2000,
      );
    };
    // RxJS instanceof TimeoutError expects TimeoutErrorImpl for some reason
    // await expect(t).rejects.toThrow(TimeoutError);
    await expect(t).rejects.toThrow();
  });
});
