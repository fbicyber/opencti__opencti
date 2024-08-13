import React from 'react';
import Alert from '@mui/material/Alert';
import makeStyles from '@mui/styles/makeStyles';
import ListLines from '../../../components/list_lines/ListLines';
import IngestionTaxiiLines, { IngestionTaxiiLinesQuery } from './ingestionTaxii/IngestionTaxiiLines';
import IngestionTaxiiCreation from './ingestionTaxii/IngestionTaxiiCreation';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useAuth from '../../../utils/hooks/useAuth';
import { useFormatter } from '../../../components/i18n';
import { INGESTION_MANAGER } from '../../../utils/platformModulesHelper';
import IngestionMenu from './IngestionMenu';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Security from '../../../utils/Security';
import { INGESTION_SETINGESTIONS } from '../../../utils/hooks/useGranted';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { IngestionTaxiiLineDummy } from './ingestionTaxii/IngestionTaxiiLine';
import { IngestionTaxiiLinesPaginationQuery, IngestionTaxiiLinesPaginationQuery$variables } from './ingestionTaxii/__generated__/IngestionTaxiiLinesPaginationQuery.graphql';

const LOCAL_STORAGE_KEY = 'ingestionTaxii';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles(() => ({
  container: {
    margin: 0,
    padding: '0 200px 50px 0',
  },
}));

const IngestionTaxii = () => {
  const classes = useStyles();
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Ingestion: TAXII Feeds | Data'));
  const { platformModuleHelpers } = useAuth();
  const {
    viewStorage,
    paginationOptions,
    helpers,
  } = usePaginationLocalStorage<IngestionTaxiiLinesPaginationQuery$variables>(LOCAL_STORAGE_KEY, {
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
        width: '25%',
        isSortable: true,
      },
      version: {
        label: 'Version',
        width: '10%',
        isSortable: true,
      },
      ingestion_running: {
        label: 'Running',
        width: '10%',
        isSortable: false,
      },
      last_execution_date: {
        label: 'Last run',
        width: '15%',
        isSortable: false,
      },
      added_after_start: {
        label: 'Added after date',
        width: '10%',
        isSortable: false,
      },
      current_state_cursor: {
        label: 'Next cursor',
        width: '10%',
        isSortable: false,
      },
    };
    const queryRef = useQueryLoading<IngestionTaxiiLinesPaginationQuery>(
      IngestionTaxiiLinesQuery,
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
                    <IngestionTaxiiLineDummy key={idx} dataColumns={dataColumns} />
                  ))}
              </>
            }
          >
            <IngestionTaxiiLines
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
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Data') }, { label: t_i18n('Ingestion') }, { label: t_i18n('TAXII feeds'), current: true }]} />
      <IngestionMenu/>
      {renderLines()}
      <Security needs={[INGESTION_SETINGESTIONS]}>
        <IngestionTaxiiCreation paginationOptions={paginationOptions} />
      </Security>
    </div>
  );
};

export default IngestionTaxii;
