import { createDomainObject, deleteDomainObject, goToObjectOverview, selectObject } from './domain_object_service';

export async function navigateToCountry(id = '') {
  await goToObjectOverview('locations', 'countries', id);
}

export async function selectCountry(name: string) {
  await navigateToCountry();
  await selectObject(name);
}

export async function createCountry(name: string, description: string) {
  await createDomainObject('locations', 'countries', name, description);
}

export async function deleteCountry(name: string) {
  await selectCountry(name);
  await deleteDomainObject();
}
