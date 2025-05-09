import React from 'react';
import { UsersLinesPaginationQuery, UsersLinesPaginationQuery$variables } from '@components/settings/users/__generated__/UsersLinesPaginationQuery.graphql';
import { UsersLines_data$data } from '@components/settings/users/__generated__/UsersLines_data.graphql';
import { useFormatter } from '../../../../components/i18n';
import DataTable from '../../../../components/dataGrid/DataTable';
import { emptyFilterGroup } from '../../../../utils/filters/filtersUtils';
import { usePaginationLocalStorage } from '../../../../utils/hooks/useLocalStorage';
import { UsePreloadedPaginationFragment } from '../../../../utils/hooks/usePreloadedPaginationFragment';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';
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

  const { helpers: storageHelpers } = usePaginationLocalStorage<UsersLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    event_type: { percentWidth: 25 },
    event_scope: { percentWidth: 25 },
    timestamp: { percentWidth: 25 },
    context_data: { percentWidth: 25 },
  };

  const queryRef = useQueryLoading<UsersLinesPaginationQuery>(
    userHistoryLinesQuery,
  );

  const preloadedPaginationOptions = {
    linesQuery: userHistoryLinesQuery,
    linesFragment: userHistoryLinesFragment,
    queryRef,
    nodePath: ['audits', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<UsersLinesPaginationQuery>;

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
            lineFragment={userHistoryLineFragment}
            preloadedPaginationProps={preloadedPaginationOptions}
          />
        )}
      </ExportContextProvider>
    </div>
  );
};

export default UserHistoryTab;
