import 'chromedriver';

import DriverService from './common/driver_service';
import { getXpathNodeWith, wait } from './common/action_service';
import { checkValues, deleteDomainObject } from './common/domain_object_service';
import { logIn_LocalStrategy } from './common/auth_service';
import { createCity, selectCity, updateCity } from './common/city_service';

describe('City workflow', () => {
  const NAME = '00000000 test city';
  const NEW_NAME = '00000000 test city rename';
  const DESCRIPTION = 'test city description';
  const LATITUDE = 32.7157; // San Diego, CA
  const LONGITUDE = 117.1611;
  let firstExternalRef = '';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create a city', async () => {
    const { author, marking, externalRef, country, admin_area } = await createCity(
      NAME,
      DESCRIPTION,
      {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        select: { author: true, marking: true, externalRef: true, country: true, admin_area: true },
      },
    );
    firstExternalRef = externalRef;
    await wait(1000); // Wait for relationships to populate
    await selectCity(NAME);

    // Check that name is correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);
    // Check that lat and long are correct on the minimap title
    const minimapTitle = await getXpathNodeWith('contains(text(), "Mini map")', '');
    const minimapTitleText = await minimapTitle.getText();
    expect(minimapTitleText).toBe(`MINI MAP (LAT. ${LATITUDE}, LONG. ${LONGITUDE})`);
    // Check that dropdown selections where applied for author, marking, and external ref
    await checkValues({ author, marking, externalRef: true, country, admin_area: admin_area || undefined });
  });

  test('edit a city', async () => {
    const newDescription = 'updated test city description';
    const newLat = 45.4408; // Venice, Italy
    const newLong = 12.3155;
    const { author, marking, country, admin_area } = await updateCity(
      NAME,
      {
        name: NEW_NAME,
        description: newDescription,
        latitude: newLat,
        longitude: newLong,
        oldExternalRef: firstExternalRef,
        select: { author: true, marking: true, externalRef: true, country: true, admin_area: true },
      },
    );
    await wait(500); // Wait for relationships to populate
    await selectCity(NEW_NAME);
    // Check that lat and long are correct on the minimap title
    const minimapTitle = await getXpathNodeWith('contains(text(), "Mini map")', '');
    const minimapTitleText = await minimapTitle.getText();
    expect(minimapTitleText).toBe(`MINI MAP (LAT. ${newLat}, LONG. ${newLong})`);
    // Check that all values were correctly updated
    await checkValues({ author, marking, externalRef: true, country, admin_area: admin_area || undefined });
  });

  test('delete a city', async () => {
    await selectCity(NEW_NAME);
    await deleteDomainObject();
    await wait(1000); // Wait for page to reload
    // Check that Area no longer shows up
    const checkForCity = async () => { await getXpathNodeWith('text', NEW_NAME, { xpath: '/ancestor::a', timeout: 2000 }); };
    await expect(checkForCity).rejects.toThrow();
  });
});
