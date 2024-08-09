import React from 'react';
import Alert from '@mui/material/Alert';
import makeStyles from '@mui/styles/makeStyles';
import ListLines from '../../../components/list_lines/ListLines';
import IngestionRssLines, { ingestionRssLinesQuery } from './ingestionRss/IngestionRssLines';
import IngestionRssCreation from './ingestionRss/IngestionRssCreation';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useAuth from '../../../utils/hooks/useAuth';
import { useFormatter } from '../../../components/i18n';
import { INGESTION_MANAGER } from '../../../utils/platformModulesHelper';
import IngestionMenu from './IngestionMenu';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Security from '../../../utils/Security';
import { INGESTION_SETINGESTIONS } from '../../../utils/hooks/useGranted';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { IngestionRssLinesPaginationQuery, IngestionRssLinesPaginationQuery$variables } from './ingestionRss/__generated__/IngestionRssLinesPaginationQuery.graphql';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { IngestionRssLineDummy } from './ingestionRss/IngestionRssLine';

const LOCAL_STORAGE_KEY = 'ingestionRss';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles(() => ({
  container: {
    margin: 0,
    padding: '0 200px 50px 0',
  },
}));

const IngestionRss = () => {
  const classes = useStyles();
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Ingestion: RSS Feeds | Data'));
  const { platformModuleHelpers } = useAuth();
  const {
    viewStorage,
    paginationOptions,
    helpers,
  } = usePaginationLocalStorage<IngestionRssLinesPaginationQuery$variables>(LOCAL_STORAGE_KEY, {
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
        width: '20%',
        isSortable: true,
      },
      uri: {
        label: 'URL',
        width: '30%',
        isSortable: true,
      },
      ingestion_running: {
        label: 'Running',
        width: '20%',
        isSortable: false,
      },
      current_state_date: {
        label: 'Current state',
        isSortable: false,
        width: '15%',
      },
    };
    const queryRef = useQueryLoading<IngestionRssLinesPaginationQuery>(
      ingestionRssLinesQuery,
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
      >
        {queryRef && (
        <React.Suspense
          fallback={
            <>
              {Array(20)
                .fill(0)
                .map((_, idx) => (
                  <IngestionRssLineDummy key={idx} dataColumns={dataColumns} />
                ))}
            </>
          }
        >
          <IngestionRssLines
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
  if (!platformModuleHelpers.isIngestionManagerEnable()) {
    return (
      <div className={classes.container}>
        <Alert severity="info">
          {t_i18n(platformModuleHelpers.generateDisableMessage(INGESTION_MANAGER))}
        </Alert>
        <IngestionMenu/>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Data') }, { label: t_i18n('Ingestion') }, { label: t_i18n('RSS feeds'), current: true }]} />
      <IngestionMenu/>
      {renderLines()}
      <Security needs={[INGESTION_SETINGESTIONS]}>
        <IngestionRssCreation
          paginationOptions={paginationOptions}
        />
      </Security>
    </div>
  );
};

export default IngestionRss;
