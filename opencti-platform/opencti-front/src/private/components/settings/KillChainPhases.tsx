import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { graphql } from 'react-relay';
import type { Theme } from '../../../components/Theme';
import { useFormatter } from '../../../components/i18n';
import ListLines from '../../../components/list_lines/ListLines';
import KillChainPhasesLines, { killChainPhasesLinesQuery } from './kill_chain_phases/KillChainPhasesLines';
import KillChainPhaseCreation from './kill_chain_phases/KillChainPhaseCreation';
import LabelsVocabulariesMenu from './LabelsVocabulariesMenu';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { KillChainPhasesLinesPaginationQuery, KillChainPhasesLinesPaginationQuery$variables } from './kill_chain_phases/__generated__/KillChainPhasesLinesPaginationQuery.graphql';
import { KillChainPhaseLineDummy } from './kill_chain_phases/KillChainPhaseLine';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles<Theme>(() => ({
  container: {
    margin: 0,
    padding: '0 200px 50px 0',
  },
}));

export const killChainPhasesSearchQuery = graphql`
  query KillChainPhasesSearchQuery($search: String) {
    killChainPhases(search: $search) {
      edges {
        node {
          id
          kill_chain_name
          phase_name
          x_opencti_order
        }
      }
    }
  }
`;

const LOCAL_STORAGE_KEY = 'killChainPhases';

const KillChainPhases = () => {
  const classes = useStyles();
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Taxonomies: Kill Chain Phases | Settings'));

  const { viewStorage, paginationOptions, helpers } = usePaginationLocalStorage<KillChainPhasesLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    {
      sortBy: 'x_opencti_order',
      orderAsc: true,
      searchTerm: '',
    },
  );

  const renderLines = () => {
    const { sortBy, orderAsc, searchTerm } = viewStorage;
    const dataColumns = {
      kill_chain_name: {
        label: 'Kill chain name',
        width: '30%',
        isSortable: true,
      },
      phase_name: {
        label: 'Phase name',
        width: '35%',
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
    const queryRef = useQueryLoading<KillChainPhasesLinesPaginationQuery>(
      killChainPhasesLinesQuery,
      paginationOptions,
    );
    return (
      <ListLines
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleSort={helpers.handleSort}
        handleSearch={helpers.handleSearch}
        displayImport={false}
        secondaryAction={true}
        keyword={searchTerm}
      >
        {queryRef && (
          <React.Suspense
            fallback={
              <>
                {Array(20)
                  .fill(0)
                  .map((_, idx) => (
                    <KillChainPhaseLineDummy
                      key={idx}
                      dataColumns={dataColumns}
                    />
                  ))}
              </>
            }
          >
            <KillChainPhasesLines
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
      <LabelsVocabulariesMenu />
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Settings') }, { label: t_i18n('Taxonomies') }, { label: t_i18n('Kill chain phases'), current: true }]} />
      { renderLines() }
      <KillChainPhaseCreation paginationOptions={paginationOptions} />
    </div>
  );
};

export default KillChainPhases;
