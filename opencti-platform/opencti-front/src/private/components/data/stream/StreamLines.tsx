import React, { FunctionComponent } from 'react';
import { graphql, PreloadedQuery } from 'react-relay';
import usePreloadedPaginationFragment from '../../../../utils/hooks/usePreloadedPaginationFragment';
import ListLinesContent from '../../../../components/list_lines/ListLinesContent';
import { StreamLineComponent, StreamLineDummy } from './StreamLine';
import { StreamLinesPaginationQuery, StreamLinesPaginationQuery$variables } from './__generated__/StreamLinesPaginationQuery.graphql';
import { DataColumns } from '../../../../components/list_lines';
import { UseLocalStorageHelpers } from '../../../../utils/hooks/useLocalStorage';
import { StreamLines_data$key } from './__generated__/StreamLines_data.graphql';

const nbOfRowsToLoad = 50;

interface StreamLinesProps {
  queryRef: PreloadedQuery<StreamLinesPaginationQuery>;
  dataColumns: DataColumns;
  paginationOptions?: StreamLinesPaginationQuery$variables;
  setNumberOfElements: UseLocalStorageHelpers['handleSetNumberOfElements'];

}
export const StreamLinesQuery = graphql`
  query StreamLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: StreamCollectionOrdering
    $orderMode: OrderingMode
  ) {
    ...StreamLines_data
      @arguments(
        search: $search
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        orderMode: $orderMode
      )
  }
`;

const StreamLinesFragment = graphql`
       fragment StreamLines_data on Query
      @argumentDefinitions(
        search: { type: "String" }
        count: { type: "Int", defaultValue: 25 }
        cursor: { type: "ID" }
        orderBy: { type: "StreamCollectionOrdering", defaultValue: name }
        orderMode: { type: "OrderingMode", defaultValue: asc }
      ) {
        streamCollections(
          search: $search
          first: $count
          after: $cursor
          orderBy: $orderBy
          orderMode: $orderMode
        ) @connection(key: "Pagination_streamCollections") {
          edges {
            node {
              ...StreamLine_node
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
const StreamLines: FunctionComponent<StreamLinesProps> = ({
  setNumberOfElements,
  queryRef,
  dataColumns,
  paginationOptions,
}) => {
  const { data, hasMore, loadMore, isLoadingMore } = usePreloadedPaginationFragment<
  StreamLinesPaginationQuery,
  StreamLines_data$key>({
    queryRef,
    linesQuery: StreamLinesQuery,
    linesFragment: StreamLinesFragment,
    nodePath: ['streamCollections', 'pageInfo', 'globalCount'],
    setNumberOfElements,
  });
  return (
    <>
      <ListLinesContent
        initialLoading={!data}
        loadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoadingMore}
        dataList={data?.streamCollections?.edges ?? []}
        globalCount={data?.streamCollections?.pageInfo?.globalCount ?? nbOfRowsToLoad}
        LineComponent={StreamLineComponent}
        DummyLineComponent={StreamLineDummy}
        dataColumns={dataColumns}
        nbOfRowsToLoad={nbOfRowsToLoad}
        paginationOptions={paginationOptions}
      />
    </>
  );
};

export default StreamLines;
