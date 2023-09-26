import 'chromedriver';
import DriverService from './common/driver_service';
import {
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

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

describe('Analyses Groupings Workflow', () => {
  const NAME = 'Test Analyses Groupings';
  const NEW_NAME = 'UPDATED Test Analyses Groupings';
  const DESCRIPTION = 'Test Analyses Groupings Description';
  const NEW_DESCRIPTION = 'updated test analyses grouping description';

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
  });

  test('view an analyses grouping', async () => {
    await navigateToAnalysesGroupings();
    await selectAnalysesGroupings(NAME);
    await wait(3000);

    // Check that name is correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);

    // Check that description is correct
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'case-analyses-groupings-description',
      'p',
    );
    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

  test('edit an analyses grouping', async () => {
    await editAnalysesGroupings(NEW_NAME, NEW_DESCRIPTION);
    await wait(3000);
    await selectAnalysesGroupings(NEW_NAME);
    await wait(3000);
  });

  test('delete a analyses grouping', async () => {
    // make sure that the element exists before trying to delete
    try {
      await getXpathNodeWith('aria-label', NEW_NAME)
        .then((elem) => elem.getText())
        .then((val) => expect(val).toBe(NEW_NAME));
    } catch (error) {
      console.error(`Could not find analyses grouping for ${NEW_NAME}`);
      throw error;
    }
    await navigateToAnalysesGroupings();
    await selectAnalysesGroupings(NEW_NAME);
    await wait(3000);
    // Need to pass in delete button ID or ERROR: Variable "$id" of non-null type "ID!" must not be null.
    await deleteDomainObject('delete-grouping-button');
    await wait(5000);

    try {
      getXpathNodeWith('aria-label', NEW_NAME)
        .then((elem) => expect(elem).toBeNull());
    } catch (error) {
      console.error(`Case was not deleted ${NEW_NAME}`);
      throw error;
    }
  });
});
