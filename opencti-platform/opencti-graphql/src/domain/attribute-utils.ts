import {
  aliases,
  authorizedMembers,
  baseType,
  createdAt,
  creators,
  draftChange,
  draftIds,
  entityLocationType,
  entityType,
  files,
  iAliasedIds,
  id,
  identityClass,
  internalId,
  lang,
  modified,
  parentTypes,
  relationshipType,
  revoked,
  standardId,
  updatedAt,
  xOpenctiAliases,
  xOpenctiStixIds,
  xOpenctiType
} from '../schema/attribute-definition';

export const INTERNAL_ATTRIBUTES = [
  // ID
  id.name,
  internalId.name,
  standardId.name,
  draftIds.name,
  draftChange.name,
  xOpenctiStixIds.name,
  iAliasedIds.name,
  // Auditing
  createdAt.name,
  updatedAt.name,
  modified.name,
  // Technical
  entityType.name,
  parentTypes.name,
  entityLocationType.name,
  baseType.name,
  relationshipType.name,
  xOpenctiType.name,
  identityClass.name,
  creators.name,
  files.name,
  lang.name,
  revoked.name,
  aliases.name,
  'fromType',
  'toType',
  'i_inference_weight',
  'content_mapping',
  'caseTemplate',
  'default_dashboard',
  'default_hidden_types',
  'grantable_groups',
  authorizedMembers.name,
  'authorized_authorities',
  'precision',
  'pattern_version',
  'connections',
  'i_attributes',
  // X - Mitre
  'x_mitre_permissions_required',
  'x_mitre_detection',
  'x_opencti_graph_data',
  // X - OpenCTI
  xOpenctiAliases.name,
  'x_opencti_workflow_id',
  'x_opencti_detection',
  'x_opencti_threat_hunting',
  'x_opencti_log_sources',
  'x_opencti_firstname',
  'x_opencti_lastname',
  'x_opencti_cvss_integrity_impact',
  'x_opencti_cvss_availability_impact',
  'x_opencti_cvss_confidentiality_impact',
  'x_opencti_additional_names',
  // Decay internal fields on Indicator
  'decay_next_reaction_date',
  'decay_base_score',
  'decay_base_score_date',
  'decay_history',
  'decay_applied_rule',
  // Opinions
  'opinions_metrics'
];

export const INTERNAL_REFS = [
  'objectOrganization'
];
