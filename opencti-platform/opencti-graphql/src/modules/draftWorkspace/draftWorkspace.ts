import { v4 as uuidv4 } from 'uuid';
import { ABSTRACT_INTERNAL_OBJECT, ABSTRACT_STIX_CORE_OBJECT } from '../../schema/general';
import { type ModuleDefinition, registerDefinition } from '../../schema/module';
import { createdAt, creators } from '../../schema/attribute-definition';
import { ENTITY_TYPE_DRAFT_WORKSPACE, type StixDraftWorkspace, type StoreEntityDraftWorkspace } from './draftWorkspace-types';
import convertDraftWorkspaceToStix from './draftWorkspace-converter';

const DRAFT_WORKSPACE_DEFINITION: ModuleDefinition<StoreEntityDraftWorkspace, StixDraftWorkspace> = {
  type: {
    id: 'draftWorkspace',
    name: ENTITY_TYPE_DRAFT_WORKSPACE,
    category: ABSTRACT_INTERNAL_OBJECT,
    aliased: false
  },
  identifier: {
    definition: {
      [ENTITY_TYPE_DRAFT_WORKSPACE]: () => uuidv4()
    },
  },
  attributes: [
    createdAt,
    creators,
    { name: 'name', label: 'Draft name', type: 'string', format: 'short', mandatoryType: 'internal', editDefault: false, multiple: false, upsert: false, isFilterable: true },
    { name: 'entity_id', label: 'Related entity', type: 'string', format: 'id', entityTypes: [ABSTRACT_STIX_CORE_OBJECT], mandatoryType: 'internal', editDefault: false, multiple: false, upsert: false, isFilterable: true },
  ],
  relations: [],
  relationsRefs: [],
  representative: (stix: StixDraftWorkspace) => {
    return stix.name;
  },
  converter_2_1: convertDraftWorkspaceToStix
};

registerDefinition(DRAFT_WORKSPACE_DEFINITION);
