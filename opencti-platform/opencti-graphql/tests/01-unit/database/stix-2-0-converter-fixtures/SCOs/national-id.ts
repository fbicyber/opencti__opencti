import type { StoreCyberObservable } from '../../../../../src/types/store';

export const NATIONAL_ID_INSTANCE = {
  id: '10000000-0000-4000-8000-000000000064',
  standard_id: 'national-id--20000000-0000-4000-8000-000000000064',
  entity_type: 'National-ID',
  defanged: false,
  value: '310260000000000',
  objectMarking: [],
} as unknown as StoreCyberObservable;

export const EXPECTED_NATIONAL_ID = {
  id: 'national-id--20000000-0000-4000-8000-000000000064',
  type: 'national-id',
  spec_version: '2.0',
  x_opencti_id: '10000000-0000-4000-8000-000000000064',
  x_opencti_type: 'National-ID',
  x_opencti_granted_refs: [],
  x_opencti_files: [],
  defanged: false,
  object_marking_refs: [],
  x_opencti_labels: [],
  x_opencti_external_references: [],
  value: '310260000000000',
  labels: [],
  external_references: [],
};
