import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { graphql } from 'react-relay';
import type { Theme } from '../../../components/Theme';
import { useFormatter } from '../../../components/i18n';
import ListLines from '../../../components/list_lines/ListLines';
import GroupsLines, { groupsLinesQuery } from './groups/GroupsLines';
import GroupCreation from './groups/GroupCreation';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { GroupsLinesPaginationQuery, GroupsLinesPaginationQuery$variables } from './groups/__generated__/GroupsLinesPaginationQuery.graphql';
import { GroupLineDummy } from './groups/GroupLine';
import AccessesMenu from './AccessesMenu';

const useStyles = makeStyles<Theme>(() => ({
  container: {
    margin: 0,
    padding: '0 200px 50px 0',
  },
}));

export const groupsSearchQuery = graphql`
  query GroupsSearchQuery($search: String) {
    groups(search: $search) {
      edges {
        node {
          id
          name
          description
          created_at
          updated_at
          roles {
            edges {
              node {
                id
                name
              }
            }
          }
          group_confidence_level {
            max_confidence
          }
        }
      }
    }
  }
`;

const LOCAL_STORAGE_KEY = 'groups';

const Groups = () => {
  const classes = useStyles();
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Security: Groups | Settings'));

  const { viewStorage, paginationOptions, helpers } = usePaginationLocalStorage<GroupsLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    {
      sortBy: 'name',
      orderAsc: true,
      searchTerm: '',
    },
  );

  const renderLines = () => {
    const { sortBy, orderAsc, searchTerm } = viewStorage;
    const queryRef = useQueryLoading<GroupsLinesPaginationQuery>(
      groupsLinesQuery,
      paginationOptions,
    );
    const dataColumns = {
      name: {
        label: 'Name',
        width: '20%',
        isSortable: true,
      },
      default_assignation: {
        label: 'Default membership',
        width: '12%',
        isSortable: true,
      },
      auto_new_marking: {
        label: 'Auto new markings',
        width: '12%',
        isSortable: true,
      },
      no_creators: {
        label: 'No creators',
        width: '12%',
        isSortable: true,
      },
      group_confidence_level: {
        label: 'Max Confidence',
        width: '12%',
        isSortable: true,
      },
      created_at: {
        label: 'Platform creation date',
        width: '15%',
        isSortable: true,
      },
      updated_at: {
        label: 'Modification date',
        width: '15%',
        isSortable: true,
      },
    };
    return (
      <ListLines
        helpers={helpers}
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleSort={helpers.handleSort}
        handleSearch={helpers.handleSearch}
        displayImport={false}
        secondaryAction={false}
        keyword={searchTerm}
      >
        {queryRef && (
          <React.Suspense
            fallback={
              <>
                {Array(20)
                  .fill(0)
                  .map((_, idx) => (
                    <GroupLineDummy
                      key={idx}
                      dataColumns={dataColumns}
                    />
                  ))}
              </>
            }
          >
            <GroupsLines
              queryRef={queryRef}
              paginationOptions={paginationOptions}
              dataColumns={dataColumns}
              setNumberOfElements={helpers.handleSetNumberOfElements}
            />
          </React.Suspense>
        )}
      </ListLines>
    );
  };

  return (
    <div className={classes.container} data-testid="groups-settings-page">
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Settings') }, { label: t_i18n('Security') }, { label: t_i18n('Groups'), current: true }]} />
      <AccessesMenu />
      { renderLines() }
      <GroupCreation paginationOptions={paginationOptions} />
    </div>
  );
};

export default Groups;
