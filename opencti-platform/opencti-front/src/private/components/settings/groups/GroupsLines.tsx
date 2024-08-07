import React, { FunctionComponent } from 'react';
import { graphql, PreloadedQuery } from 'react-relay';
import ListLinesContent from '../../../../components/list_lines/ListLinesContent';
import { GroupLine, GroupLineDummy, GroupDataColumnsType } from './GroupLine';
import { GroupsLinesPaginationQuery, GroupsLinesPaginationQuery$variables } from './__generated__/GroupsLinesPaginationQuery.graphql';
import { UseLocalStorageHelpers } from '../../../../utils/hooks/useLocalStorage';
import usePreloadedPaginationFragment from '../../../../utils/hooks/usePreloadedPaginationFragment';
import { GroupsLines_data$key } from './__generated__/GroupsLines_data.graphql';

const nbOfRowsToLoad = 50;

interface GroupsLinesProps {
  queryRef: PreloadedQuery<GroupsLinesPaginationQuery>;
  dataColumns: GroupDataColumnsType;
  paginationOptions: GroupsLinesPaginationQuery$variables;
  setNumberOfElements: UseLocalStorageHelpers['handleSetNumberOfElements'];
}

export const groupsLinesQuery = graphql`
  query GroupsLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: GroupsOrdering
    $orderMode: OrderingMode
  ) {
    ...GroupsLines_data
      @arguments(
        search: $search
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        orderMode: $orderMode
      )
  }
`;

const groupsLinesFragment = graphql`
fragment GroupsLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "GroupsOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
  )
  @refetchable(queryName: "GroupsLinesRefetchQuery") {
    groups(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
    ) @connection(key: "Pagination_groups") {
      edges {
        node {
          ...GroupLine_node
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

const GroupsLines: FunctionComponent<GroupsLinesProps> = ({
  queryRef,
  dataColumns,
  paginationOptions,
  setNumberOfElements,
}) => {
  const { data, hasMore, loadMore, isLoadingMore } = usePreloadedPaginationFragment<
  GroupsLinesPaginationQuery,
  GroupsLines_data$key
  >({
    linesQuery: groupsLinesQuery,
    linesFragment: groupsLinesFragment,
    queryRef,
    nodePath: ['groups', 'edges'],
    setNumberOfElements,
  });
  return (
    <ListLinesContent
      initialLoading={!data}
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoadingMore}
      dataList={data?.groups?.edges ?? []}
      globalCount={data?.groups?.pageInfo?.globalCount ?? nbOfRowsToLoad}
      LineComponent={GroupLine}
      DummyLineComponent={GroupLineDummy}
      dataColumns={dataColumns}
      nbOfRowsToLoad={nbOfRowsToLoad}
      paginationOptions={paginationOptions}
    />
  );
};

export default GroupsLines;
