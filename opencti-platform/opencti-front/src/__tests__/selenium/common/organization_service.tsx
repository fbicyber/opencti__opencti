import { By } from 'selenium-webdriver';
import { selectRandomFromDropdown } from './action_service';
import { createDomainObject, deleteDomainObject, goToObjectOverview, selectObject } from './domain_object_service';

export async function navigateToOrg(id = '') {
  await goToObjectOverview('entities', 'organizations', id);
}

export async function selectOrg(name: string) {
  await navigateToOrg();
  await selectObject(name);
}

export async function createOrg(name: string, description: string) {
  await createDomainObject(
    'entities',
    'organizations',
    name,
    description,
    undefined,
    async (): Promise<void> => {
      const reliability = By.id('mui-component-select-x_opencti_reliability');
      await selectRandomFromDropdown(reliability);
    },
  );
}

export async function deleteOrg(name: string) {
  await selectOrg(name);
  await deleteDomainObject();
}
