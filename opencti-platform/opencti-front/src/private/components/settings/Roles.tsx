import React, { FunctionComponent } from 'react';
import { useFormatter } from '../../../components/i18n';
import ListLines from '../../../components/list_lines/ListLines';
import RolesLines, { rolesLinesQuery } from './roles/RolesLines';
import AccessesMenu from './AccessesMenu';
import RoleCreation from './roles/RoleCreation';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { RolesLinesPaginationQuery, RolesLinesPaginationQuery$variables } from './roles/__generated__/RolesLinesPaginationQuery.graphql';
import { RoleLineDummy } from './roles/RoleLine';

const LOCAL_STORAGE_KEY = 'roles';

const Roles: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Security: Roles | Settings'));

  const {
    viewStorage,
    helpers,
    paginationOptions,
  } = usePaginationLocalStorage<RolesLinesPaginationQuery$variables>(LOCAL_STORAGE_KEY, {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
  });

  const renderLines = () => {
    const { sortBy, orderAsc, searchTerm } = viewStorage;
    const queryRef = useQueryLoading<RolesLinesPaginationQuery>(
      rolesLinesQuery,
      paginationOptions,
    );
    const dataColumns = {
      name: {
        label: 'Name',
        width: '45%',
        isSortable: true,
      },
      groups: {
        label: 'Groups with this role',
        width: '15%',
        isSortable: false,
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
                    <RoleLineDummy
                      key={idx}
                      dataColumns={dataColumns}
                    />
                  ))}
              </>
            }
          >
            <RolesLines
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
    <div data-testid='roles-settings-page'>
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Settings') }, { label: t_i18n('Security') }, { label: t_i18n('Roles'), current: true }]} />
      <AccessesMenu />
      { renderLines() }
      <RoleCreation paginationOptions={paginationOptions} />
    </div>
  );
};

export default Roles;
