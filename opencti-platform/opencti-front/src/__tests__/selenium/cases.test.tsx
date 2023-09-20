import 'chromedriver';
import { By } from 'selenium-webdriver';
import DriverService from './common/driver_service';
import {
  getElementWithTimeout,
  getSubElementWithTimeout,
  wait,
  getXpathNodeWith,
} from './common/action_service';
import { deleteDomainObject } from './common/domain_object_service';
import {
  addCaseIncidentResponse,
  navigateToCaseIncidentResponse,
  selectCaseIncidentResponse,
  editCaseIncidentResponse,
} from './common/case_service';
import { logIn_LocalStrategy } from './common/auth_service';

describe('Case Incident Response Workflow', () => {
  const NAME = 'Test Case Incident Response';
  const NEW_NAME = 'UPDATED Test Case Incident';
  const DESCRIPTION = 'Test Case Incident Response Description';
  const NEW_DESCRIPTION = 'UPDATED Test Case Incident Response Description';

  beforeAll(async () => {
    await logIn_LocalStrategy();
    await wait(); // Wait for login
  });

  afterAll(async () => {
    await DriverService.teardownDriver();
  });

  test('create a case incident response', async () => {
    await navigateToCaseIncidentResponse();
    await addCaseIncidentResponse(NAME, DESCRIPTION);
    await wait(5000);
    await selectCaseIncidentResponse(NAME);
    // Check that name and description are correct
    const nameField = await getXpathNodeWith('text', NAME);
    const actualName = await nameField.getText();
    expect(actualName).toBe(NAME);
    const descriptionField = await getSubElementWithTimeout(
      'id',
      'case-incident-response-description',
      'p',
    );
    const actualDescription = await descriptionField.getText();
    expect(actualDescription).toBe(DESCRIPTION);
  });

//   test('view a case incident response', async () => {
  // try{

  // } catch {

  // }
//     await navigateToCaseIncidentResponse();
//     await selectCaseIncidentResponse(NAME);
//     await wait(3000);
//     // Check that name and description are correct
//     const nameField = await getXpathNodeWith('text', NAME);
//     const actualName = await nameField.getText();
//     expect(actualName).toBe(NAME);
//     const descriptionField = await getSubElementWithTimeout(
//       'id',
//       'case-incident-response-description',
//       'p',
//     );
//     const actualDescription = await descriptionField.getText();
//     expect(actualDescription).toBe(DESCRIPTION);
//   });

//   test('edit a case incident response', async () => {
//     await navigateToCaseIncidentResponse();
//     await wait(2000);
//     await selectCaseIncidentResponse(NAME);
//     await wait(2000);
//     await editCaseIncidentResponse(NEW_NAME, NEW_DESCRIPTION);
//     await wait(2000);
//     // Check that name and description are correct
//     const nameField = await getXpathNodeWith('text', NEW_NAME);
//     const actualName = await nameField.getText();
//     expect(actualName).toBe(NEW_NAME);
//     await wait(2000);
//     const descriptionField = await getSubElementWithTimeout(
//       'id',
//       'case-incident-response-description',
//       'p',
//     );
//     const actualDescription = await descriptionField.getText();
//     expect(actualDescription).toBe(NEW_DESCRIPTION);
//   });

//   test('delete a case incident response', async () => {
//     await navigateToCaseIncidentResponse();
//     await selectCaseIncidentResponse(NEW_NAME);

//     await wait(3000);

//     await deleteDomainObject();
//     await wait(3000);
//     // Check Case Incident Response no longer shows up
//     const t = async () => {
//       await getElementWithTimeout(
//         By.xpath(`//*[text()="${NEW_NAME}"]/ancestor::a`),
//         2000,
//       );
//     };
//     // RxJS instanceof TimeoutError expects TimeoutErrorImpl for some reason
//     // await expect(t).rejects.toThrow(TimeoutError);
//     await expect(t).rejects.toThrow();
//   });
});
