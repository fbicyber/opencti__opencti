import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildViewParamsFromUrlAndStorage } from '../../../utils/ListParameters';
import { QueryRenderer } from '../../../relay/environment';
import { useFormatter } from '../../../components/i18n';
import ListLines from '../../../components/list_lines/ListLines';
import StreamLines, { StreamLinesQuery } from './stream/StreamLines';
import StreamCollectionCreation from './stream/StreamCollectionCreation';
import SharingMenu from './SharingMenu';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { TAXIIAPI_SETCOLLECTIONS } from '../../../utils/hooks/useGranted';
import Security from '../../../utils/Security';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { OrderMode, PaginationOptions } from '../../../components/list_lines';

const LOCAL_STORAGE_KEY = 'stream';

const useStyles = makeStyles(() => ({
  container: {
    margin: 0,
    padding: '0 200px 50px 0',
  },
}));

const Stream = () => {
  const { t_i18n } = useFormatter();
  const classes = useStyles();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Data Sharing: Live Streams | Data'));
  const navigate = useNavigate();
  const location = useLocation();
  const params = buildViewParamsFromUrlAndStorage(
    navigate,
    location,
    LOCAL_STORAGE_KEY,
  );
  const [streamState, setStreamState] = useState<{ orderAsc: boolean, searchTerm: string, view: string, sortBy: string }>({
    orderAsc: params.orderAsc !== false,
    searchTerm: params.searchTerm ?? '',
    view: params.view ?? 'lines',
    sortBy: params.sortBy ?? 'name',
  });

  function handleSearch(value: string) {
    setStreamState({ ...streamState, searchTerm: value });
  }
  function handleSort(field: string, orderAsc: boolean) {
    setStreamState({ ...streamState, sortBy: field, orderAsc });
  }
  function renderLines(paginationOptions: PaginationOptions) {
    const { searchTerm, sortBy, orderAsc, view } = streamState;
    const dataColumns = {
      name: {
        label: 'Name',
        width: '25%',
        isSortable: true,
      },
      description: {
        label: 'Description',
        width: '25%',
        isSortable: false,
      },
      objectLabel: {
        label: 'Labels',
        width: '20%',
        isSortable: false,
      },
      created: {
        label: 'Original creation date',
        width: '15%',
        isSortable: true,
      },
      modified: {
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
        currentView={view}
        displayImport={false}
        secondaryAction={true}
        keyword={searchTerm}
      >
        <QueryRenderer
          query={StreamLinesQuery}
          variables={{ count: 25, ...paginationOptions }}
          render={({ props }: any) => (
            <StreamLines
              data={props}
              paginationOptions={paginationOptions}
              dataColumns={dataColumns}
              initialLoading={props === null}
            />
          )}
        />
      </ListLines>
    );
  }
  const paginationOptions: PaginationOptions = {
    search: streamState.searchTerm,
    orderBy: streamState.sortBy,
    orderMode: streamState.orderAsc ? OrderMode.asc : OrderMode.desc,
  };
  return (
    <div className={classes.container}>
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Data') }, { label: t_i18n('Data sharing') }, { label: t_i18n('Live streams'), current: true }]} />
      <SharingMenu/>
      {streamState.view === 'lines' ? renderLines(paginationOptions) : ''}
      <Security needs={[TAXIIAPI_SETCOLLECTIONS]}>
        <StreamCollectionCreation paginationOptions={paginationOptions} />
      </Security>
    </div>
  );
};

export default Stream;
