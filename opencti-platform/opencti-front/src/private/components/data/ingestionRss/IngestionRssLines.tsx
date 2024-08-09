import { graphql, PreloadedQuery, usePreloadedQuery, useRefetchableFragment } from 'react-relay';
import React, { FunctionComponent, useEffect } from 'react';
import { interval } from 'rxjs';
import { IngestionRssLinesPaginationQuery, IngestionRssLinesPaginationQuery$variables } from './__generated__/IngestionRssLinesPaginationQuery.graphql';
import { IngestionRssLines_data$key } from './__generated__/IngestionRssLines_data.graphql';
import ListLinesContent from '../../../../components/list_lines/ListLinesContent';
import { IngestionRssLineDummy } from './IngestionRssLine';
import usePreloadedPaginationFragment from '../../../../utils/hooks/usePreloadedPaginationFragment';
import { FIVE_SECONDS } from '../../../../utils/Time';
import { DataColumns } from '../../../../components/list_lines';
import { UseLocalStorageHelpers } from '../../../../utils/hooks/useLocalStorage';

const nbOfRowsToLoad = 50;
interface IngestionRssLinesProps {
  queryRef: PreloadedQuery<IngestionRssLinesPaginationQuery>;
  dataColumns: DataColumns;
  paginationOptions?: IngestionRssLinesPaginationQuery$variables;
  setNumberOfElements: UseLocalStorageHelpers['handleSetNumberOfElements'];
}

export const ingestionRssLinesQuery = graphql`
  query ingestionRssLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: IngestionRssOrdering
    $orderMode: OrderingMode
  ) {
    ...IngestionRssLines_data
      @arguments(
        search: $search
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        orderMode: $orderMode
      )
  }
`;
const ingestionRssLinesFragment = graphql`
  fragment IngestionRssLines_data on Query
      @argumentDefinitions(
        search: { type: "String" }
        count: { type: "Int", defaultValue: 25 }
        cursor: { type: "ID" }
        orderBy: { type: "IngestionRssOrdering", defaultValue: name }
        orderMode: { type: "OrderingMode", defaultValue: asc }
      ) {
        ingestionRsss(
          search: $search
          first: $count
          after: $cursor
          orderBy: $orderBy
          orderMode: $orderMode
        ) @connection(key: "Pagination_ingestionRsss") {
          edges {
            node {
              ...IngestionRssLine_node
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
const IngestionRssLines: FunctionComponent<IngestionRssLinesProps> = ({
  setNumberOfElements,
  queryRef,
  dataColumns,
  paginationOptions,
}) => {
  const { data, hasMore, loadMore, isLoadingMore } = usePreloadedPaginationFragment<
  IngestionRssLinesPaginationQuery,
  IngestionRssLines_data$key>({
    queryRef,
    linesQuery: ingestionRssLinesQuery,
    linesFragment: ingestionRssLinesFragment,
    nodePath: ['ingestionRss', 'pageInfo', 'globalCount'],
    setNumberOfElements,
  });
  const queryData = usePreloadedQuery(ingestionRssLinesQuery, queryRef);

  const [_, refetch] = useRefetchableFragment<
  IngestionRssLinesPaginationQuery,
  IngestionRssLines_data$key
  >(ingestionRssLinesFragment, queryData);

  useEffect(() => {
    const subscription = interval(FIVE_SECONDS).subscribe(() => {
      refetch({}, { fetchPolicy: 'store-and-network' });
    });
    return function cleanup() {
      subscription.unsubscribe();
    };
  }, [refetch]);

  return (
    <>
      <ListLinesContent
        initialLoading={!data}
        isLoading={isLoadingMore}
        loadMore={loadMore}
        hasMore={hasMore}
        dataList={data?.ingestionRsss?.edges ?? []}
        globalCount={data?.ingestionRsss?.pageInfo?.globalCount ?? nbOfRowsToLoad}
        LineComponent={IngestionRssLine}
        DummyLineComponent={IngestionRssLineDummy}
        dataColumns={dataColumns}
        nbOfRowsToLoad={nbOfRowsToLoad}
        paginationOptions={paginationOptions}
      />
    </>
  );
};

export default IngestionRssLines;
