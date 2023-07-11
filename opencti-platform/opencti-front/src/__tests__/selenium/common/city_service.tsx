import {
  CreateOptions,
  UpdateData,
  createDomainObject,
  deleteDomainObject,
  goToObjectOverview,
  selectObject,
  updateDomainObject,
} from './domain_object_service';

const LOCATION = 'locations';
const CITY = 'cities';

export async function navigateToCity(id = '') {
  await goToObjectOverview(LOCATION, CITY, id);
}

export async function selectCity(name: string) {
  await navigateToCity();
  await selectObject(name);
}

export async function createCity(name: string, description: string, options: CreateOptions) {
  const selected = await createDomainObject(LOCATION, CITY, name, description, options);
  return selected;
}

export async function updateCity(name: string, data: UpdateData) {
  const selected = await updateDomainObject(LOCATION, CITY, name, data);
  return selected;
}

export async function deleteCity(name: string) {
  await selectCity(name);
  await deleteDomainObject();
}
