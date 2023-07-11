import 'chromedriver';

import DriverService from './common/driver_service';
import { getXpathNodeWith, wait } from './common/action_service';
import { checkValues, deleteDomainObject } from './common/domain_object_service';
import { logIn_LocalStrategy } from './common/auth_service';
import {
  createArea,
  editArea,
  selectArea,
} from './common/area_service';

describe('Area workflow', () => {
  const NAME = '00000000 test area';
  const NEW_NAME = '00000000 test area rename';
  const DESCRIPTION = 'test area description';
  const LATITUDE = 35.652832;
  const LONGITUDE = 139.839478;
  // let firstExternalRef = '';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create an area', async () => {
    const { author, marking } = await createArea(
      NAME,
      DESCRIPTION,
      {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        select: { author: true, marking: true, externalRef: true },
      },
    );
    // firstExternalRef = externalRef;
    await selectArea(NAME);

    // Check that name is correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);
    // Check that lat and long are correct on the minimap title
    const minimapTitle = await getXpathNodeWith('contains(text(), "Mini map")', '');
    const minimapTitleText = await minimapTitle.getText();
    expect(minimapTitleText).toBe(`MINI MAP (LAT. ${LATITUDE}, LONG. ${LONGITUDE})`);
    // Check that dropdown selections where applied for author, marking, and external ref
    await checkValues({ author, marking, externalRef: true });
  });

  test('edit an area', async () => {
    const newDescription = 'updated test area description';
    const newLat = 27.1751;
    const newLong = 78.0421;
    const { author, marking } = await editArea(
      NAME,
      {
        name: NEW_NAME,
        description: newDescription,
        latitude: newLat,
        longitude: newLong,
        // oldExternalRef: firstExternalRef,
        select: { author: true, marking: true, externalRef: true },
      },
    );
    await selectArea(NEW_NAME);
    // Check that lat and long are correct on the minimap title
    const minimapTitle = await getXpathNodeWith('contains(text(), "Mini map")', '');
    const minimapTitleText = await minimapTitle.getText();
    expect(minimapTitleText).toBe(`MINI MAP (LAT. ${newLat}, LONG. ${newLong})`);
    // Check that all values were correctly updated
    await checkValues({ author, marking, externalRef: true });
  });

  test('delete an area', async () => {
    await selectArea(NEW_NAME);
    await deleteDomainObject();
    await wait(1000); // Wait for page to reload
    // Check that Area no longer shows up
    const checkForArea = async () => { await getXpathNodeWith('text', NEW_NAME, { xpath: '/ancestor::a', timeout: 2000 }); };
    await expect(checkForArea).rejects.toThrow();
  });
});
