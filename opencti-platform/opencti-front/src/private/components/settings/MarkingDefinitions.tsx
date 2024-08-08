import React, { FunctionComponent } from 'react';
import { useFormatter } from '../../../components/i18n';
import ListLines from '../../../components/list_lines/ListLines';
import MarkingDefinitionsLines, { markingDefinitionsLinesQuery } from './marking_definitions/MarkingDefinitionsLines';
import AccessesMenu from './AccessesMenu';
import MarkingDefinitionCreation from './marking_definitions/MarkingDefinitionCreation';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import {
  MarkingDefinitionsLinesPaginationQuery,
  MarkingDefinitionsLinesPaginationQuery$variables,
} from './marking_definitions/__generated__/MarkingDefinitionsLinesPaginationQuery.graphql';
import { MarkingDefinitionLineDummy } from './marking_definitions/MarkingDefinitionLine';

const LOCAL_STORAGE_KEY = 'MarkingDefinitions';

const MarkingDefinitions: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Security: Marking Definitions | Settings'));

  const {
    viewStorage,
    helpers,
    paginationOptions,
  } = usePaginationLocalStorage<MarkingDefinitionsLinesPaginationQuery$variables>(LOCAL_STORAGE_KEY, {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
  });

  const renderLines = () => {
    const { sortBy, orderAsc, searchTerm } = viewStorage;
    const queryRef = useQueryLoading<MarkingDefinitionsLinesPaginationQuery>(
      markingDefinitionsLinesQuery,
      paginationOptions,
    );
    const dataColumns = {
      definition_type: {
        label: 'Type',
        width: '25%',
        isSortable: true,
      },
      definition: {
        label: 'Definition',
        width: '25%',
        isSortable: true,
      },
      x_opencti_color: {
        label: 'Color',
        width: '15%',
        isSortable: true,
      },
      x_opencti_order: {
        label: 'Order',
        width: '10%',
        isSortable: true,
      },
      created: {
        label: 'Original creation date',
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
                    <MarkingDefinitionLineDummy
                      key={idx}
                      dataColumns={dataColumns}
                    />
                  ))}
              </>
            }
          >
            <MarkingDefinitionsLines
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
    <div
      style={{
        margin: 0,
        padding: '0 200px 0 0',
      }}
    >
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Settings') }, { label: t_i18n('Security') }, { label: t_i18n('Marking definitions'), current: true }]} />
      <AccessesMenu />
      { renderLines() }
      <MarkingDefinitionCreation paginationOptions={paginationOptions} />
    </div>
  );
};

export default MarkingDefinitions;
