import 'chromedriver';
import { By } from 'selenium-webdriver';
import DriverService from './common/driver_service';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
  getXpathNodeWith,
} from './common/action_service';
import {
  addAnalysesGroupings,
  navigateToAnalysesGroupings,
  selectAnalysesGroupings,
  editAnalysesGroupings,
} from './common/groupings_service';
import { deleteDomainObject } from './common/domain_object_service';
import { logIn_LocalStrategy } from './common/auth_service';

describe('Analyses Groupings Workflow', () => {
  const NAME = 'Test Analyses Groupings';
  const NEW_NAME = 'UPDATED Test Analyses Groupings';
  const DESCRIPTION = 'Test Analyses Groupings Description';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create an analyses grouping', async () => {
    await navigateToAnalysesGroupings();
    await addAnalysesGroupings(NAME, DESCRIPTION);
    await wait(5000);
    await selectAnalysesGroupings(NAME);
    // Check that name and description are correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'case-analyses-groupings-description',
      'p',
    );
    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

  test('view an analyses grouping', async () => {
    await navigateToAnalysesGroupings();
    await selectAnalysesGroupings(NAME);
    await wait(3000);
    // Check that name and description are correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'case-analyses-groupings-description',
      'p',
    );
    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

  test('edit an analyses grouping', async () => {
    const NEW_DESCRIPTION = 'updated test analyses grouping description';
    await editAnalysesGroupings(NEW_NAME, NEW_DESCRIPTION);
    await wait(3000);
    await selectAnalysesGroupings(NEW_NAME);
    await wait(3000);
    // Check that all fields are updated correctly
    const newNameField = await getXpathNodeWith('text', NEW_NAME);
    const newActualName = await newNameField.getText();
    expect(newActualName).toBe(NEW_NAME);
    const newDescriptionField = await getSubElementWithTimeout(
      'id',
      'case-analyses-groupings-description',
      'p',
    );
    const newActualDescription = await newDescriptionField.getText();
    expect(newActualDescription).toBe(NEW_DESCRIPTION);
  });

  test('delete a analyses grouping', async () => {
    await navigateToAnalysesGroupings();
    await selectAnalysesGroupings(NEW_NAME);
    await wait(3000);
    // Need to pass in delete button ID or ERROR: Variable "$id" of non-null type "ID!" must not be null.
    await deleteDomainObject('delete-grouping-button');
    await wait(5000);

    // Check analyses grouping report no longer shows up
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
