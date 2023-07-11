import 'chromedriver';
import DriverService from './common/driver_service';
import {
  getSubElementWithTimeout,
  wait,
  getDateTime,
} from './common/action_service';
import {
  addSightings,
  navigateToSightings,
  selectSightings,
} from './common/sightings_service';
import { logIn_LocalStrategy } from './common/auth_service';

describe('Sightings Workflow', () => {
  const DESCRIPTION = 'Test Sightings Description';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create a sighting', async () => {
    const FIRST_DATE = getDateTime();
    const LAST_DATE = getDateTime();
    await navigateToSightings();
    await addSightings(FIRST_DATE, LAST_DATE, DESCRIPTION);
    await wait(5000);
    await selectSightings(DESCRIPTION);
    // Check that description is correct
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'event-sightings-description',
      'p',
    );
    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

  test('view a sighting', async () => {
    await navigateToSightings();
    await selectSightings(DESCRIPTION);
    await wait(3000);
  });
});
