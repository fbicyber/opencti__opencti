import React, { FunctionComponent } from 'react';
import { graphql, PreloadedQuery } from 'react-relay';
import ListLinesContent from '../../../../components/list_lines/ListLinesContent';
import KillChainPhaseLine, { KillChainPhaseLineDummy, DataColumnsType } from './KillChainPhaseLine';
import { KillChainPhasesLinesPaginationQuery, KillChainPhasesLinesPaginationQuery$variables } from './__generated__/KillChainPhasesLinesPaginationQuery.graphql';
import { UseLocalStorageHelpers } from '../../../../utils/hooks/useLocalStorage';
import usePreloadedPaginationFragment from '../../../../utils/hooks/usePreloadedPaginationFragment';
import { KillChainPhasesLines_data$key } from './__generated__/KillChainPhasesLines_data.graphql';

const nbOfRowsToLoad = 50;

interface KillChainPhasesLinesProps {
  queryRef: PreloadedQuery<KillChainPhasesLinesPaginationQuery>;
  dataColumns: DataColumnsType; // TODO
  paginationOptions: KillChainPhasesLinesPaginationQuery$variables;
  setNumberOfElements: UseLocalStorageHelpers['handleSetNumberOfElements'];
}

export const killChainPhasesLinesQuery = graphql`
  query KillChainPhasesLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: KillChainPhasesOrdering
    $orderMode: OrderingMode
  ) {
    ...KillChainPhasesLines_data
      @arguments(
        search: $search
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        orderMode: $orderMode
      )
  }
`;

const killChainPhasesLinesFragment = graphql`
  fragment KillChainPhasesLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "KillChainPhasesOrdering", defaultValue: phase_name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
  ) 
  @refetchable(queryName: "KillChainPhasesLinesRefetchQuery") {
    killChainPhases(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
    ) @connection(key: "Pagination_killChainPhases") {
      edges {
        node {
          ...KillChainPhaseLine_node
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        globalCount
      }
    }
  }
`;

export const killChainPhasesLinesSearchQuery = graphql`
  query KillChainPhasesLinesSearchQuery($search: String) {
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

const KillChainPhasesLines: FunctionComponent<KillChainPhasesLinesProps> = ({
  queryRef,
  dataColumns,
  paginationOptions,
  setNumberOfElements,
}) => {
  const { data, hasMore, loadMore, isLoadingMore } = usePreloadedPaginationFragment<
  KillChainPhasesLinesPaginationQuery,
  KillChainPhasesLines_data$key
  >({
    linesQuery: killChainPhasesLinesQuery,
    linesFragment: killChainPhasesLinesFragment,
    queryRef,
    nodePath: ['killChainPhases', 'edges'],
    setNumberOfElements,
  });

  return (
    <ListLinesContent
      initialLoading={!data}
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoadingMore}
      dataList={data?.killChainPhases?.edges ?? []}
      globalCount={
        data?.killChainPhases?.pageInfo?.globalCount ?? nbOfRowsToLoad
      }
      LineComponent={KillChainPhaseLine}
      DummyLineComponent={KillChainPhaseLineDummy}
      dataColumns={dataColumns}
      nbOfRowsToLoad={nbOfRowsToLoad}
      paginationOptions={paginationOptions}
    />
  );
};

export default KillChainPhasesLines;
