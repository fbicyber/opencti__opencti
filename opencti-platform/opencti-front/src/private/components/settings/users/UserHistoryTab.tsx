import React, { useState, FunctionComponent, useEffect, ReactNode, useContext } from 'react';
import { graphql, PreloadedQuery, usePreloadedQuery, useQueryLoader } from 'react-relay';
import { UserHistoryLinesQuery, UserHistoryLinesQuery$variables } from '@components/settings/users/__generated__/UserHistoryLinesQuery.graphql';
import userHistoryLinesFragment, { userHistoryLinesQuery } from './UserHistoryLines';
import { useFormatter } from '../../../../components/i18n';
import useGranted, { SETTINGS_SECURITYACTIVITY, KNOWLEDGE } from '../../../../utils/hooks/useGranted';
import { GqlFilterGroup } from '../../../../utils/filters/filtersUtils';
import DataTable from '../../../../components/dataGrid/DataTable';
import userHistoryLineFragment from './UserHistoryLine';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../../utils/filters/filtersUtils';
import { UsersLinesPaginationQuery, UsersLinesPaginationQuery$variables } from '@components/settings/users/__generated__/UsersLinesPaginationQuery.graphql';
import { usePaginationLocalStorage } from '../../../../utils/hooks/useLocalStorage';
import { UsersLines_data$data } from '@components/settings/users/__generated__/UsersLines_data.graphql';
import UsersLines, { usersLinesQuery } from './UsersLines';
import { UsePreloadedPaginationFragment } from '../../../../utils/hooks/usePreloadedPaginationFragment';
import Security from '../../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../../utils/hooks/useGranted';
import UserCreation from './UserCreation';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';
import { groupsQuery } from '../../common/form/GroupField';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import ExportContextProvider from '../../../../utils/ExportContextProvider';

const LOCAL_STORAGE_KEY = 'userHistory';

const createdByUserRedirectButton = {
  float: 'left',
  marginTop: '-15px',
};

interface UserHistoryTabProps {
  userId: string;
}

const dataColumns = {
  id: {
    label: 'ID',
    width: 150,
    isSortable: true,
  },
  timestamp: {
    label: 'Timestamp',
    width: 200,
    isSortable: true,
    format: (value: string) => new Date(value).toLocaleString(),
  },
  event_type: {
    label: 'Event Type',
    width: 120,
    isSortable: true,
  },
  event_scope: {
    label: 'Action',
    width: 120,
    isSortable: true,
  },
  user_name: {
    label: 'User',
    width: 150,
    isSortable: true,
    format: (value: string, data: any) => data.user?.name || 'Unknown',
  },
  message: {
    label: 'Description',
    width: 300,
    isSortable: false,
    format: (value: string) => (
      <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{value || 'N/A'}</div>
    ),
  },
  commit: {
    label: 'Commit',
    width: 200,
    isSortable: false,
    format: (value: string) => value || 'N/A',
  },
};

const UserHistoryTab: FunctionComponent<UserHistoryTabProps> = ({ userId }) => {
  const { t_i18n } = useFormatter();
  const [entitySearchTerm, setEntitySearchTerm] = useState<string>('');
  const isGrantedToAudit = useGranted([SETTINGS_SECURITYACTIVITY]);
  const isGrantedToKnowledge = useGranted([KNOWLEDGE]);

  const initialValues = {
    filters: emptyFilterGroup,
    searchTerm: '',
    sortBy: 'created_at',
    orderAsc: false,
    openExports: false,
    types: ['User History'],
  };

  const { viewStorage: { filters }, paginationOptions, helpers: storageHelpers } = usePaginationLocalStorage<UsersLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('User History', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as UsersLinesPaginationQuery$variables;

  const handleSearchEntity = (value: string) => {
    setEntitySearchTerm(value);
  };

  const [queryRef, loadQuery] = useQueryLoader<UserHistoryLinesQuery>(userHistoryLinesQuery);

  let historyTypes = ['History'];
  if (isGrantedToAudit && !isGrantedToKnowledge) {
    historyTypes = ['Activity'];
  } else if (isGrantedToAudit && isGrantedToKnowledge) {
    historyTypes = ['History', 'Activity'];
  }

  const queryArgs: UserHistoryLinesQuery$variables = {
    types: historyTypes,
    filters: {
      mode: 'or',
      filterGroups: [],
      filters: [
        { key: ['user_id'], values: [userId], operator: 'wildcard', mode: 'or' },
        { key: ['context_data.id'], values: [userId], operator: 'wildcard', mode: 'or' },
      ],
    } as GqlFilterGroup,
    first: 10,
    orderBy: 'timestamp',
    orderMode: 'desc',
    search: entitySearchTerm,
  };

  useEffect(() => {
    loadQuery(queryArgs, { fetchPolicy: 'store-and-network' });
  }, [entitySearchTerm, loadQuery]);

  const preloadedPaginationOptions = {
    linesQuery: usersLinesQuery,
    linesFragment: userHistoryLinesFragment,
    queryRef,
    nodePath: ['stixCyberObservables', 'pageInfo', 'globalCount'],
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
            exportContext={{ entity_type: 'Artifact' }}
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