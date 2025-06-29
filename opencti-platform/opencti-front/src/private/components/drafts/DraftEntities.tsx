import React, { FunctionComponent, ReactNode, useState } from 'react';
import { DraftEntitiesLinesPaginationQuery, DraftEntitiesLinesPaginationQuery$variables } from '@components/drafts/__generated__/DraftEntitiesLinesPaginationQuery.graphql';
import { useParams } from 'react-router-dom';
import { graphql } from 'react-relay';
import { DraftEntitiesLines_data$data } from '@components/drafts/__generated__/DraftEntitiesLines_data.graphql';
import StixDomainObjectCreation from '@components/common/stix_domain_objects/StixDomainObjectCreation';
import StixCyberObservableCreation from '@components/observations/stix_cyber_observables/StixCyberObservableCreation';
import { DraftEntities_node$data } from '@components/drafts/__generated__/DraftEntities_node.graphql';
import useAuth from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { useBuildEntityTypeBasedFilterContext, emptyFilterGroup } from '../../../utils/filters/filtersUtils';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { computeLink } from '../../../utils/Entity';

const draftEntitiesLineFragment = graphql`
    fragment DraftEntities_node on StixCoreObject {
        id
        standard_id
        entity_type
        created_at
        representative {
          main
        }
        draftVersion {
          draft_operation
        }
        objectMarking {
            id
            definition
            x_opencti_order
            x_opencti_color
        }
        objectLabel {
            id
            value
            color
        }
        createdBy {
            ... on Identity {
                id
                name
                entity_type
            }
        }
        creators {
            id
            name
        }
    }
`;

const draftEntitiesLinesQuery = graphql`
    query DraftEntitiesLinesPaginationQuery(
        $draftId: String!
        $types: [String]
        $search: String
        $count: Int!
        $cursor: ID
        $orderBy: StixCoreObjectsOrdering
        $orderMode: OrderingMode
        $filters: FilterGroup
    ) {
        ...DraftEntitiesLines_data
        @arguments(
            draftId: $draftId
            types: $types
            search: $search
            count: $count
            cursor: $cursor
            orderBy: $orderBy
            orderMode: $orderMode
            filters: $filters
        )
    }
`;

export const draftEntitiesLinesFragment = graphql`
    fragment DraftEntitiesLines_data on Query
    @argumentDefinitions(
        draftId: { type: "String!" }
        types: { type: "[String]" }
        search: { type: "String" }
        count: { type: "Int", defaultValue: 25 }
        cursor: { type: "ID" }
        orderBy: { type: "StixCoreObjectsOrdering", defaultValue: name }
        orderMode: { type: "OrderingMode", defaultValue: asc }
        filters: { type: "FilterGroup" }
    )
    @refetchable(queryName: "DraftEntitiesLinesRefetchQuery") {
        draftWorkspaceEntities(
            draftId: $draftId
            types: $types
            search: $search
            first: $count
            after: $cursor
            orderBy: $orderBy
            orderMode: $orderMode
            filters: $filters
        ) @connection(key: "Pagination_draftWorkspaceEntities") {
            edges {
                node {
                    id
                    ...DraftEntities_node
                }
            }
            pageInfo {
                endCursor
                hasNextPage
                globalCount
            }
        }
    }
`;

const LOCAL_STORAGE_KEY = 'draft_entities';

interface DraftEntitiesProps {
  entitiesType?: string;
  excludedEntitiesType?: string;
  isReadOnly: boolean;
}

const DraftEntities : FunctionComponent<DraftEntitiesProps> = ({
  entitiesType = 'Stix-Core-Object',
  excludedEntitiesType,
  isReadOnly,
}) => {
  const { draftId } = useParams() as { draftId: string };
  const [open, setOpen] = useState(false);
  const [openCreateEntity, setOpenCreateEntity] = useState(false);
  const [openCreateObservable, setOpenCreateObservable] = useState(false);
  const { platformModuleHelpers: { isRuntimeFieldEnable } } = useAuth();
  const handleCloseCreateEntity = () => {
    setOpenCreateEntity(false);
    setOpen(false);
  };
  const handleCloseCreateObservable = () => {
    setOpenCreateObservable(false);
    setOpen(false);
  };

  const initialValues = {
    filters: {
      ...emptyFilterGroup,
    },
    searchTerm: '',
    sortBy: 'name',
    orderAsc: false,
    openExports: false,
    redirectionMode: 'overview',
    draftId,
  };

  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage<DraftEntitiesLinesPaginationQuery$variables>(LOCAL_STORAGE_KEY, initialValues);
  const {
    filters,
    searchTerm,
  } = viewStorage;
  const contextFilters = useBuildEntityTypeBasedFilterContext(entitiesType, filters, excludedEntitiesType);
  const relevantDraftOperationFilter = { key: 'draft_change.draft_operation', values: ['create', 'update', 'delete'], operator: 'eq', mode: 'or' };
  const toolbarFilters = { ...contextFilters, filters: [...contextFilters.filters, relevantDraftOperationFilter] };
  const queryPaginationOptions = {
    ...paginationOptions,
    draftId,
    filters: contextFilters,
  } as unknown as DraftEntitiesLinesPaginationQuery$variables;

  const queryRef = useQueryLoading<DraftEntitiesLinesPaginationQuery>(
    draftEntitiesLinesQuery,
    queryPaginationOptions,
  );

  const preloadedPaginationProps = {
    linesQuery: draftEntitiesLinesQuery,
    linesFragment: draftEntitiesLinesFragment,
    queryRef,
    nodePath: ['draftWorkspaceEntities', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<DraftEntitiesLinesPaginationQuery>;

  const isRuntimeSort = isRuntimeFieldEnable() ?? false;
  const dataColumns: DataTableProps['dataColumns'] = {
    draftVersion: {
      isSortable: false,
      percentWidth: 10,
    },
    entity_type: {
      percentWidth: 12,
      isSortable: true,
    },
    name: {
      percentWidth: 25,
      isSortable: true,
    },
    createdBy: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
    },
    creator: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
    },
    objectLabel: {
      percentWidth: 15,
      isSortable: false,
    },
    created_at: {
      percentWidth: 10,
      isSortable: true,
    },
    objectMarking: {
      isSortable: isRuntimeSort,
      percentWidth: 8,
    },
  };

  let createButton: ReactNode;
  if (!isReadOnly) {
    createButton = entitiesType === 'Stix-Cyber-Observable' ? (
      <>
        <StixCyberObservableCreation
          display={open}
          contextual={false}
          inputValue={searchTerm}
          paginationKey="Pagination_draftWorkspaceEntities"
          paginationOptions={queryPaginationOptions}
          speeddial={false}
          open={openCreateObservable}
          controlledDialStyles={{ marginLeft: 1 }}
          handleClose={handleCloseCreateObservable}
          type={undefined}
          defaultCreatedBy={undefined}
        />
      </>
    ) : (
      <>
        <StixDomainObjectCreation
          display={true}
          inputValue={searchTerm}
          paginationKey="Pagination_draftWorkspaceEntities"
          paginationOptions={queryPaginationOptions}
          speeddial={false}
          controlledDialStyles={{ marginLeft: 1 }}
          open={openCreateEntity}
          handleClose={handleCloseCreateEntity}
          onCompleted={() => setOpenCreateEntity(false)}
          stixDomainObjectTypes={entitiesType}
          creationCallback={undefined}
          confidence={undefined}
          defaultCreatedBy={undefined}
          isFromBulkRelation={undefined}
          defaultMarkingDefinitions={undefined}
        />
      </>
    );
  }

  const getRedirectionLink = (stixObject: DraftEntities_node$data) => {
    if (isReadOnly) {
      const isUpdatedEntity = stixObject.draftVersion?.draft_operation === 'update' || stixObject.draftVersion?.draft_operation === 'update_linked';
      return isUpdatedEntity ? `/dashboard/id/${stixObject.id}` : `/dashboard/id/${stixObject.standard_id}`;
    }
    return computeLink(stixObject);
  };

  return (
    <span data-testid="draft-entities-page">
      {queryRef && (
        <DataTable
          dataColumns={dataColumns}
          resolvePath={(data: DraftEntitiesLines_data$data) => data.draftWorkspaceEntities?.edges?.map((n) => n?.node)}
          storageKey={LOCAL_STORAGE_KEY}
          initialValues={initialValues}
          toolbarFilters={toolbarFilters}
          preloadedPaginationProps={preloadedPaginationProps}
          useComputeLink={getRedirectionLink}
          lineFragment={draftEntitiesLineFragment}
          entityTypes={[entitiesType]}
          removeFromDraftEnabled
          disableLineSelection={isReadOnly}
          createButton={createButton}
        />
      )}
    </span>
  );
};

export default DraftEntities;
