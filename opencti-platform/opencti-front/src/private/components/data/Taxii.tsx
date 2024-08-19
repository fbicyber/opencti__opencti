import React, { FunctionComponent } from 'react';
import { TaxiiLinesPaginationQuery, TaxiiLinesPaginationQuery$variables } from '@components/data/taxii/__generated__/TaxiiLinesPaginationQuery.graphql';
import Box from '@mui/material/Box';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import ListLines from '../../../components/list_lines/ListLines';
import TaxiiLines, { TaxiiLinesQuery } from './taxii/TaxiiLines';
import TaxiiCollectionCreation from './taxii/TaxiiCollectionCreation';
import SharingMenu from './SharingMenu';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { useFormatter } from '../../../components/i18n';
import { TAXIIAPI_SETCOLLECTIONS } from '../../../utils/hooks/useGranted';
import Security from '../../../utils/Security';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useHelper from '../../../utils/hooks/useHelper';
import { TaxiiLineDummy } from './taxii/TaxiiLine';
import { useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';

const LOCAL_STORAGE_KEY = 'taxii';

const Taxii: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { isFeatureEnable } = useHelper();
  const isFABReplaced = isFeatureEnable('FAB_REPLACEMENT');
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Data Sharing: TAXII Collections | Data'));
  const { viewStorage, helpers, paginationOptions } = usePaginationLocalStorage<TaxiiLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    {
      searchTerm: '',
      sortBy: 'name',
      view: 'lines',
      orderAsc: false,
      numberOfElements: {
        number: 0,
        symbol: '',
      },
    },
  );
  const renderLines = () => {
    const { searchTerm, sortBy, orderAsc, numberOfElements, filters } = viewStorage;
    const dataColumns = {
      name: {
        label: 'Name',
        width: '15%',
        isSortable: true,
      },
      description: {
        label: 'Description',
        width: '15%',
        isSortable: false,
      },
      id: {
        label: 'Collection',
        width: '25%',
        isSortable: true,
      },
      filters: {
        label: 'Filters',
        width: '45%',
        isSortable: false,
      },
    };
    const contextFilters = useBuildEntityTypeBasedFilterContext('Taxii', filters);
    const queryPaginationOptions = {
      ...paginationOptions,
      filters: contextFilters,
    } as unknown as TaxiiLinesPaginationQuery$variables;

    const queryRef = useQueryLoading<TaxiiLinesPaginationQuery>(
      TaxiiLinesQuery,
      queryPaginationOptions,
    );
    return (
      <ListLines
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleSort={helpers.handleSort}
        handleSearch={helpers.handleSearch}
        displayImport={false}
        paginationOptions={queryPaginationOptions}
        secondaryAction={true}
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
                  <TaxiiLineDummy key={idx} dataColumns={dataColumns} />
                ))}
            </>
          }
        >
          <TaxiiLines
            queryRef={queryRef}
            paginationOptions={queryPaginationOptions}
            dataColumns={dataColumns}
            setNumberOfElements={helpers.handleSetNumberOfElements}
          />
        </React.Suspense>
        )}
      </ListLines>
    );
  };

  return (
    <Box sx={{
      margin: 0,
      padding: '0 200px 50px 0',
    }}
      aria-label="TaxiiCollections"
    >
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Data') }, { label: t_i18n('Data sharing') }, { label: t_i18n('TAXII collections'), current: true }]} />
      <SharingMenu/>
      {renderLines()}
      {!isFABReplaced && (
      <Security needs={[TAXIIAPI_SETCOLLECTIONS]}>
        <TaxiiCollectionCreation paginationOptions={paginationOptions} />
      </Security>
      )}
    </Box>
  );
};

export default Taxii;
