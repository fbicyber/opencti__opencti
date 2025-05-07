import React from 'react';
import { useFormatter } from '../../../../components/i18n';
import DataTable from '../../../../components/dataGrid/DataTable';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../../utils/filters/filtersUtils';
import { UsersLinesPaginationQuery, UsersLinesPaginationQuery$variables } from '@components/settings/users/__generated__/UsersLinesPaginationQuery.graphql';
import { usePaginationLocalStorage } from '../../../../utils/hooks/useLocalStorage';
import { UsersLines_data$data } from '@components/settings/users/__generated__/UsersLines_data.graphql';
import { UsePreloadedPaginationFragment } from '../../../../utils/hooks/usePreloadedPaginationFragment';
import Security from '../../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../../utils/hooks/useGranted';
import UserCreation from './UserCreation';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';
import { groupsQuery } from '../../common/form/GroupField';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import ExportContextProvider from '../../../../utils/ExportContextProvider';
import { DataTableProps } from '../../../../components/dataGrid/dataTableTypes';
import { userHistoryLinesFragment, userHistoryLinesQuery } from './UserHistoryLines';
import { userHistoryLineFragment } from './UserHistoryLine';

const LOCAL_STORAGE_KEY = 'userHistory';

const UserHistoryTab = () => {
  const { t_i18n } = useFormatter();

  const initialValues = {
    filters: emptyFilterGroup,
    searchTerm: '',
    sortBy: 'name',
    orderAsc: false,
    openExports: false,
  };

  const { viewStorage: { filters }, paginationOptions, helpers: storageHelpers } = usePaginationLocalStorage<UsersLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('User-History', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as UsersLinesPaginationQuery$variables;

  const dataColumns: DataTableProps['dataColumns'] = {
    id: {},
    event_type: {},
    event_scope: {},
    timestamp: {},
    context_data: {},
  };

  const queryRef = useQueryLoading<UsersLinesPaginationQuery>(
    userHistoryLinesQuery,
    queryPaginationOptions,
  );

  const preloadedPaginationOptions = {
    linesQuery: userHistoryLinesQuery,
    linesFragment: userHistoryLinesFragment,
    queryRef,
    nodePath: ['audits'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<UsersLinesPaginationQuery>;

  const defaultAssignationFilter = {
    mode: 'and',
    filters: [{ key: 'default_assignation', values: [true] }],
    filterGroups: [],
  };
  const defaultGroupsQueryRef = useQueryLoading(
    groupsQuery,
    {
      orderBy: 'name',
      orderMode: 'asc',
      filters: defaultAssignationFilter,
    },
  );

  return (
    <div data-testid="user-history-page">
      <ExportContextProvider>
        <Breadcrumbs elements={[{ label: t_i18n('Users') }, { label: t_i18n('History'), current: true }]} />
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: UsersLines_data$data) => data.users?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            toolbarFilters={contextFilters}
            lineFragment={userHistoryLineFragment}
            preloadedPaginationProps={preloadedPaginationOptions}
            exportContext={{ entity_type: 'User-History' }}
            createButton={(
              <Security needs={[KNOWLEDGE_KNUPDATE]}>
                <UserCreation
                  paginationOptions={queryPaginationOptions}
                  defaultGroupsQueryRef={defaultGroupsQueryRef}
                />
              </Security>
            )}
          />
        )}
      </ExportContextProvider>
    </div>
  );
};

export default UserHistoryTab;