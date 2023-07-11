import 'chromedriver';
import { By, WebElement, Key } from 'selenium-webdriver';
import DriverService from './common/driver_service';
import {
  clickNonClickable,
  getXpathNodeWith,
  refreshCurrentPage,
  wait,
  getElementWithTimeout,
  selectRandomFromDropdown,
} from './common/action_service';
import { checkValues, deleteDomainObject, goToKnowledgeView, goToKnowledgeViewCountries } from './common/domain_object_service';
import { logIn_LocalStrategy } from './common/auth_service';
import {
  addPosition,
  addOrganization,
  selectPosition,
  linkOrganization,
  linkCountry,
  addCountry,
} from './common/position_service';
import { createCountry } from './common/country_service';

describe('Position workflow', () => {
  const NAME = 'test position';
  const DESCRIPTION = 'test position description';
  const ORG_NAME = 'test position organization';
  const COUNTRY_NAME = 'AAA';
  const LATITUDE = 71;
  const LONGITUDE = 25;
  const NAME_UPDATED = 'Test Position Updated Name';
  const DESCRIPTION_UPDATED = 'Test position updated description';
  const LATITUDE_UPDATED = -74;
  const LONGITUDE_UPDATED = 40;

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait();
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create a position', async () => {
    await addPosition(
      NAME,
      DESCRIPTION,
      {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        select: { author: true, marking: true, externalRef: true },
      },
    );
    await selectPosition(NAME);
    await wait(1000);

    // Check that name is correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);
    // Check description, lat, long, author, marking, and external reference
    await checkValues({
      description: DESCRIPTION,
      latitude: LATITUDE,
      longitude: LONGITUDE,
      author: true,
      marking: true,
      externalRef: true,
    });
  });

  test('link a position to a Country', async () => {
    await createCountry(COUNTRY_NAME, 'aaa');
    await selectPosition(NAME);
    await goToKnowledgeViewCountries('Countries');
    await addCountry(COUNTRY_NAME);
    await linkCountry(COUNTRY_NAME);
    const linkedCountry = await getXpathNodeWith('text', COUNTRY_NAME);
    await linkedCountry.getTagName();
    expect(await linkedCountry.getText()).toBe(COUNTRY_NAME);
  });

  test('unlink an Country from a position', async () => {
    await selectPosition(NAME);
    await goToKnowledgeViewCountries('Countries');
    await wait(); // Wait for page to load
    // Select the checkbox for the linked Country
    const linkedCountryCheckbox = await getXpathNodeWith('text', COUNTRY_NAME, { xpath: '/ancestor::a//input[@type="checkbox"]' });
    await linkedCountryCheckbox.getTagName();
    await clickNonClickable(linkedCountryCheckbox);
    // Click the delete icon button on the bottom toolbar that shows up
    const deleteBtn = await getXpathNodeWith('aria-label', 'delete');
    await clickNonClickable(deleteBtn);
    // Click the Launch button to delete both the Country link and the Country
    const launchTaskBtn = await getXpathNodeWith('text', 'Launch');
    await clickNonClickable(launchTaskBtn);
    await wait(10000); // Wait for the delete background task to complete
    // Check that the Country link no longer shows up
    await refreshCurrentPage();
    await wait(1000); // Wait for page to reload
    const checkForCountryLink = async () => { await getXpathNodeWith('text', COUNTRY_NAME, { timeout: 2000 }); };
    await expect(checkForCountryLink).rejects.toThrow();
  });

  test('link a position to an organization', async () => {
    await selectPosition(NAME);
    await goToKnowledgeView('Organizations');
    await addOrganization(ORG_NAME);
    await linkOrganization(ORG_NAME);
    const linkedOrg = await getXpathNodeWith('text', ORG_NAME);
    expect(await linkedOrg.getText()).toBe(ORG_NAME);
  });

  test('unlink an organization from a position', async () => {
    await selectPosition(NAME);
    await goToKnowledgeView('Organizations');
    await wait(); // Wait for page to load
    // Select the checkbox for the linked Organization
    const linkedOrgCheckbox = await getXpathNodeWith('text', ORG_NAME, { xpath: '/ancestor::a//input[@type="checkbox"]' });
    await linkedOrgCheckbox.getTagName();
    await clickNonClickable(linkedOrgCheckbox);
    // Click the delete icon button on the bottom toolbar that shows up
    const deleteBtn = await getXpathNodeWith('aria-label', 'delete');
    await clickNonClickable(deleteBtn);
    // Click the Launch button to delete both the Organization link and the Organization
    const launchTaskBtn = await getXpathNodeWith('text', 'Launch');
    await clickNonClickable(launchTaskBtn);
    await wait(10000); // Wait for the delete background task to complete
    // Check that the Organization link no longer shows up
    await refreshCurrentPage();
    await wait(1000); // Wait for page to reload
    const checkForOrgLink = async () => { await getXpathNodeWith('text', ORG_NAME, { timeout: 2000 }); };
    await expect(checkForOrgLink).rejects.toThrow();
  });

  // Position link to Country

  test('edit a position', async () => {
    await selectPosition(NAME);
    await wait(1000);

    // Navigate to edit
    const editFabLocator = By.xpath('//button[@aria-label="Edit"]');
    // Find and click the edit button
    const editFab: WebElement = await getElementWithTimeout(editFabLocator);
    await editFab.click();

    // Update name
    await wait();
    const nameField = await getXpathNodeWith('name', 'name');
    await nameField.click();
    await wait();
    await nameField.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_UP, Key.BACK_SPACE), NAME_UPDATED, Key.ENTER);

    // Update description
    // NOTE: input boxes don't clear text with selenium webelement.clear() func, used keychord combo to clear text
    await wait();
    const descriptionField = await getXpathNodeWith('text', 'Description', { xpath: '/following-sibling::div//textarea' });
    await descriptionField.click();
    await wait();
    await descriptionField.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_UP, Key.BACK_SPACE), DESCRIPTION_UPDATED, Key.ENTER);

    // Update Latitude
    await wait();
    const latField = await getXpathNodeWith('name', 'latitude');
    await latField.click();
    await wait();
    await latField.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_UP, Key.BACK_SPACE), LATITUDE_UPDATED, Key.ENTER);

    // Update Longitude
    await wait();
    const longField = await getXpathNodeWith('name', 'longitude');
    await longField.click();
    await wait();
    await longField.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_UP, Key.BACK_SPACE), LONGITUDE_UPDATED, Key.ENTER);

    // Update Author
    await wait();
    const authorInputLocator = By.xpath(
      '//input[@name="createdBy"]/..//button[@aria-label="Open"]',
    );
    await wait();
    const authorUpdate = await selectRandomFromDropdown(authorInputLocator);

    // Update marking
    await wait();
    try {
      // Remove possible previously selected marking first
      const clearBtn = await getXpathNodeWith('data-testid', 'CancelIcon', { nth: 2, timeout: 1000 });
      await clearBtn.getTagName();
      await clearBtn.click();
      /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    } catch (ignore) { console.warn('Update marking error'); }
    // NOTE: Needed to add [2] as nth node to select on, without it, will select on markingobject input for a Note Addition and cause timeout error in selectRanddropdown function
    const markingInputLocator = By.xpath(
      '(//input[@name="objectMarking"]/..//button[@aria-label="Open"])[2]',
    );
    const markingUpdate = await selectRandomFromDropdown(markingInputLocator);
    await wait();
    await refreshCurrentPage();

    // NOTE: needs extra wait for testing on objectmarking to get correct values
    await wait(5000);
    await checkValues({
      description: DESCRIPTION_UPDATED,
      longitude: LONGITUDE_UPDATED,
      latitude: LATITUDE_UPDATED,
      author: authorUpdate,
      marking: markingUpdate,
      externalRef: true,
    });

    // Check that name has been updated correctly
    const nameFieldUpdated = await getXpathNodeWith('text', NAME_UPDATED);
    const actualNameUpdated = await nameFieldUpdated.getText();
    expect(actualNameUpdated).toBe(NAME_UPDATED);
  });

  test('delete a position', async () => {
    await selectPosition(NAME_UPDATED);
    await deleteDomainObject();
    await wait(1000); // Wait for page to reload
    // Check that Position no longer shows up
    const checkForPos = async () => { await getXpathNodeWith('text', NAME, { xpath: '/ancestor::a', timeout: 2000 }); };
    await expect(checkForPos).rejects.toThrow();
  });
});
