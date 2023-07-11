import {
  CreateOptions,
  UpdateData,
  createDomainObject,
  goToObjectOverview,
  selectObject,
  updateDomainObject,
} from './domain_object_service';

export async function navigateToArea(id = '') {
  await goToObjectOverview('locations', 'administrative_areas', id);
}

export async function selectArea(name: string) {
  await navigateToArea();
  await selectObject(name);
}

export async function createArea(name: string, description: string, options: CreateOptions = {}) {
  const selections = await createDomainObject('locations', 'administrative_areas', name, description, options);
  return selections;
}

export async function editArea(name: string, data: UpdateData) {
  const selections = await updateDomainObject('locations', 'administrative_areas', name, data);
  return selections;
}
