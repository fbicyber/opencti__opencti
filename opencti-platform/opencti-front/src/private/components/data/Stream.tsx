import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { useFormatter } from '../../../components/i18n';
import ListLines from '../../../components/list_lines/ListLines';
import StreamLines, { StreamLinesQuery } from './stream/StreamLines';
import StreamCollectionCreation from './stream/StreamCollectionCreation';
import SharingMenu from './SharingMenu';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { TAXIIAPI_SETCOLLECTIONS } from '../../../utils/hooks/useGranted';
import Security from '../../../utils/Security';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { StreamLinesPaginationQuery, StreamLinesPaginationQuery$variables } from './stream/__generated__/StreamLinesPaginationQuery.graphql';
import { StreamLineDummy } from './stream/StreamLine';

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
  const {
    viewStorage,
    paginationOptions,
    helpers,
  } = usePaginationLocalStorage<StreamLinesPaginationQuery$variables>(LOCAL_STORAGE_KEY, {
    sortBy: 'Name',
    orderAsc: true,
    searchTerm: '',
    view: 'lines',
    numberOfElements: {
      number: 0,
      symbol: '',
    },
  });
  const {
    searchTerm,
    sortBy,
    orderAsc,
    numberOfElements,
    view,
  } = viewStorage;

  const queryRef = useQueryLoading<StreamLinesPaginationQuery>(
    StreamLinesQuery,
    paginationOptions,
  );

  const renderLines = () => {
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
        helpers={helpers}
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleSort={helpers.handleSort}
        handleSearch={helpers.handleSearch}
        currentView={view}
        keyword={searchTerm}
        paginationOptions={paginationOptions}
        numberOfElements={numberOfElements}
      >
        {queryRef && (
        <React.Suspense
          fallback={
            <>
              {Array(20)
                .fill(0)
                .map((_, idx) => (
                  <StreamLineDummy key={idx} dataColumns={dataColumns} />
                ))}
            </>
              }
        >
          <StreamLines
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
    <div className={classes.container}>
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Data') }, { label: t_i18n('Data sharing') }, { label: t_i18n('Live streams'), current: true }]} />
      <SharingMenu/>
      {renderLines()}
      {view === 'lines' ? renderLines() : ''}
      <Security needs={[TAXIIAPI_SETCOLLECTIONS]}>
        <StreamCollectionCreation paginationOptions={paginationOptions} />
      </Security>
    </div>
  );
};

export default Stream;
