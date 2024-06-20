import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QueryRenderer } from '../../../relay/environment';
import { buildViewParamsFromUrlAndStorage, saveViewParameters } from '../../../utils/ListParameters';
import { useFormatter } from '../../../components/i18n';
import ListLines from '../../../components/list_lines/ListLines';
import RolesLines, { rolesLinesQuery } from './roles/RolesLines';
import AccessesMenu from './AccessesMenu';
import RoleCreation from './roles/RoleCreation';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';

const Roles: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Security: Roles | Settings'));
  const navigate = useNavigate();
  const location = useLocation();
  const LOCAL_STORAGE_KEY = 'roles';
  const params = buildViewParamsFromUrlAndStorage(navigate, location, LOCAL_STORAGE_KEY);
  const [searchTerm, setSearchTerm] = useState<string>(params.searchTerm ?? '');
  const [sortBy, sortFields] = useState<string>(params.sortBy ?? 'name');
  const [orderAsc, setOrderAsc] = useState<boolean>(true);
  const [view] = useState<string>(params.view ?? 'lines');
  const [paginationOptions, setPaginationOptions] = useState<any>({
    search: searchTerm,
    orderBy: sortBy,
    orderMode: orderAsc ? 'asc' : 'desc',
  });

  useEffect(() => {
    setPaginationOptions({
      search: searchTerm,
      orderBy: sortBy,
      orderMode: orderAsc ? 'asc' : 'desc',
    });
  }, [searchTerm, sortBy, orderAsc]);

  const saveView = () => {
    setTitle(t_i18n('Security: Roles | Settings'));
    saveViewParameters(
      navigate,
      location,
      LOCAL_STORAGE_KEY,
      {
        sortBy,
        orderAsc,
        searchTerm,
        view,
      },
    );
  };

  const handleSort = (field: string, orderAsc: boolean) => {
    sortFields(field);
    setOrderAsc(orderAsc);
    saveView();
  };
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // saveView();
  };

  const renderLines = (paginationOptions: any) => {
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
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleSort={handleSort}
        handleSearch={handleSearch}
        displayImport={false}
        secondaryAction={false}
        keyword={searchTerm}
      >
        <QueryRenderer
          query={rolesLinesQuery}
          variables={{ count: 25, ...paginationOptions }}
          render={({ props }) => (
            <RolesLines
              data={props}
              paginationOptions={paginationOptions}
              dataColumns={dataColumns}
              initialLoading={props === null}
            />
          )}
        />
      </ListLines>
    );
  };

  return (
    <div data-testid='roles-settings-page'>
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Settings') }, { label: t_i18n('Security') }, { label: t_i18n('Roles'), current: true }]} />
      <AccessesMenu />
      {view === 'lines' ? renderLines(paginationOptions) : ''}
      <RoleCreation paginationOptions={paginationOptions} />
    </div>
  );
};

export default Roles;
