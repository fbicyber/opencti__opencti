import React, { FunctionComponent, useEffect } from 'react';
import { PreloadedQuery, graphql, usePreloadedQuery, useRefetchableFragment } from 'react-relay';
import { interval } from 'rxjs';
import usePreloadedPaginationFragment from '../../../../utils/hooks/usePreloadedPaginationFragment';
import ListLinesContent from '../../../../components/list_lines/ListLinesContent';
import { TaxiiLineComponent, TaxiiLineDummy } from './TaxiiLine';
import { TaxiiLinesPaginationQuery, TaxiiLinesPaginationQuery$variables } from './__generated__/TaxiiLinesPaginationQuery.graphql';
import { UseLocalStorageHelpers } from '../../../../utils/hooks/useLocalStorage';
import { DataColumns } from '../../../../components/list_lines';
import { TaxiiLines_data$key } from './__generated__/TaxiiLines_data.graphql';
import { FIVE_SECONDS } from '../../../../utils/Time';

const nbOfRowsToLoad = 50;

interface TaxiiLinesProps {
  queryRef: PreloadedQuery<TaxiiLinesPaginationQuery>;
  dataColumns: DataColumns;
  paginationOptions: TaxiiLinesPaginationQuery$variables;
  setNumberOfElements: UseLocalStorageHelpers['handleSetNumberOfElements'];
}

export const TaxiiLinesQuery = graphql`
  query TaxiiLinesPaginationQuery(
    $search: String
    $count: Int
    $cursor: ID
    $orderBy: TaxiiCollectionOrdering
    $orderMode: OrderingMode
  ) {
    ...TaxiiLines_data
      @arguments(
        search: $search
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        orderMode: $orderMode
      )
  }
`;
const TaxiiLinesFragment = graphql`
    fragment TaxiiLines_data on Query
    @argumentDefinitions(
      search: { type: "String" }
      count: { type: "Int", defaultValue: 25 }
      cursor: { type: "ID" }
      orderBy: { type: "TaxiiCollectionOrdering", defaultValue: name }
      orderMode: { type: "OrderingMode", defaultValue: asc }
    ) 
    @refetchable(queryName: "TaxiiLinesRefetchQuery") {  
      taxiiCollections(
        search: $search
        first: $count
        after: $cursor
        orderBy: $orderBy
        orderMode: $orderMode
      ) @connection(key: "Pagination_taxiiCollections") {
        edges {
          node {
            id
            ...TaxiiLine_node
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
const TaxiiLines: FunctionComponent<TaxiiLinesProps> = ({
  setNumberOfElements,
  queryRef,
  dataColumns,
  paginationOptions,
}) => {
  const { data, hasMore, loadMore, isLoadingMore } = usePreloadedPaginationFragment<
  TaxiiLinesPaginationQuery,
  TaxiiLines_data$key>({
    queryRef,
    linesQuery: TaxiiLinesQuery,
    linesFragment: TaxiiLinesFragment,
    nodePath: ['taxiiCollections', 'pageInfo', 'globalCount'],
    setNumberOfElements,
  });
  const queryData = usePreloadedQuery(TaxiiLinesQuery, queryRef);

  const [_, refetch] = useRefetchableFragment<
  TaxiiLinesPaginationQuery,
  TaxiiLines_data$key
  >(TaxiiLinesFragment, queryData);

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
        dataList={data?.taxiiCollections?.edges ?? []}
        globalCount={data?.taxiiCollections?.pageInfo?.globalCount ?? nbOfRowsToLoad}
        LineComponent={TaxiiLineComponent}
        DummyLineComponent={TaxiiLineDummy}
        dataColumns={dataColumns}
        nbOfRowsToLoad={nbOfRowsToLoad}
        paginationOptions={paginationOptions}
      />
    </>
  );
};

export default TaxiiLines;
