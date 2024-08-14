import React from 'react';
import Alert from '@mui/material/Alert';
import makeStyles from '@mui/styles/makeStyles';
import { useTheme } from '@mui/styles';
import { Theme } from '@mui/material';
import ListLines from '../../../components/list_lines/ListLines';
import SyncLines, { SyncLinesQuery } from './sync/SyncLines';
import SyncCreation from './sync/SyncCreation';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useAuth from '../../../utils/hooks/useAuth';
import { useFormatter } from '../../../components/i18n';
import { SYNC_MANAGER } from '../../../utils/platformModulesHelper';
import IngestionMenu from './IngestionMenu';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Security from '../../../utils/Security';
import { INGESTION_SETINGESTIONS } from '../../../utils/hooks/useGranted';
import { SyncLinesPaginationQuery, SyncLinesPaginationQuery$variables } from './sync/__generated__/SyncLinesPaginationQuery.graphql';
import { SyncLineDummy } from './sync/SyncLine';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';

const LOCAL_STORAGE_KEY = 'sync';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles(() => ({
  container: {
    margin: 0,
    padding: '0 200px 50px 0',
  },
}));

const Sync = () => {
  const theme = useTheme<Theme>();
  const classes = useStyles();
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Ingestion: Remote OCTI Streams | Data'));
  const { platformModuleHelpers } = useAuth();
  const {
    viewStorage,
    paginationOptions,
    helpers,
  } = usePaginationLocalStorage<SyncLinesPaginationQuery$variables>(LOCAL_STORAGE_KEY, {
    sortBy: 'name',
    orderAsc: false,
    searchTerm: '',
    numberOfElements: {
      number: 0,
      symbol: '',
    },
  });
  const renderLines = () => {
    const { searchTerm, sortBy, orderAsc, numberOfElements } = viewStorage;
    const dataColumns = {
      name: {
        label: 'Name',
        width: '15%',
        isSortable: true,
      },
      uri: {
        label: 'URL',
        width: '20%',
        isSortable: true,
      },
      stream_id: {
        label: 'Stream ID',
        width: '20%',
        isSortable: true,
      },
      running: {
        label: 'Running',
        width: '20%',
        isSortable: false,
      },
      current_state_date: {
        label: 'Current state',
        isSortable: true,
      },
    };
    const queryRef = useQueryLoading<SyncLinesPaginationQuery>(
      SyncLinesQuery,
      paginationOptions,
    );
    return (
      <ListLines
        helpers={helpers}
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleSort={helpers.handleSort}
        handleSearch={helpers.handleSearch}
        displayImport={false}
        secondaryAction={true}
        paginationOptions={paginationOptions}
        numberOfElements={numberOfElements}
        keyword={searchTerm}
        message={
          <>
            {t_i18n(
              'You can configure your platform to consume remote OCTI streams. A list of public and commercial native feeds is available in the',
            )}{' '}
            <a
              href="https://filigran.notion.site/63392969969c4941905520d37dc7ad4a?v=0a5716cac77b4406825ba3db0acfaeb2"
              target="_blank"
              style={{ color: theme.palette.secondary.main }}
              rel="noreferrer"
            >
              OpenCTI ecosystem space
            </a>
            .
          </>
        }
      >
        {queryRef && (
        <React.Suspense
          fallback={
            <>
              {Array(20)
                .fill(0)
                .map((_, idx) => (
                  <SyncLineDummy key={idx} dataColumns={dataColumns} />
                ))}
            </>
          }
        >
          <SyncLines
            queryRef={queryRef}
            paginationOptions={paginationOptions}
            dataColumns={dataColumns}
            setNumberofElements={helpers.handleSetNumberOfElements}
          />
          </React.Suspense>
        )}
      </ListLines>
    );
  };
  if (!platformModuleHelpers.isSyncManagerEnable()) {
    return (
      <div className={classes.container}>
        <Alert severity="info">
          {t_i18n(platformModuleHelpers.generateDisableMessage(SYNC_MANAGER))}
        </Alert>
        <IngestionMenu/>
      </div>
    );
  }
  return (
    <div className={classes.container}>
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Data') }, { label: t_i18n('Ingestion') }, { label: t_i18n('Remote OCTI streams'), current: true }]} />
      <IngestionMenu/>
      {renderLines()}
      <Security needs={[INGESTION_SETINGESTIONS]}>
        <SyncCreation paginationOptions={paginationOptions} />
      </Security>
    </div>
  );
};

export default Sync;
