import React, { FunctionComponent } from 'react';
import { graphql, PreloadedQuery } from 'react-relay';
import ListLinesContent from '../../../../components/list_lines/ListLinesContent';
import { RoleLine, RoleLineDummy, RoleDataColumnsType } from './RoleLine';
import { RolesLinesPaginationQuery, RolesLinesPaginationQuery$variables } from './__generated__/RolesLinesPaginationQuery.graphql';
import { UseLocalStorageHelpers } from '../../../../utils/hooks/useLocalStorage';
import usePreloadedPaginationFragment from '../../../../utils/hooks/usePreloadedPaginationFragment';
import { RolesLines_data$key } from './__generated__/RolesLines_data.graphql';

const nbOfRowsToLoad = 50;

interface RolesLinesProps {
  queryRef: PreloadedQuery<RolesLinesPaginationQuery>;
  dataColumns: RoleDataColumnsType;
  paginationOptions: RolesLinesPaginationQuery$variables;
  setNumberOfElements: UseLocalStorageHelpers['handleSetNumberOfElements'];
}

export const rolesLinesQuery = graphql`
  query RolesLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: RolesOrdering
    $orderMode: OrderingMode
  ) {
    ...RolesLines_data
      @arguments(
        search: $search
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        orderMode: $orderMode
      )
  }
`;

const rolesLinesFragment = graphql`
  fragment RolesLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "RolesOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
  ) 
  @refetchable(queryName: "RolesLinesRefetchQuery") {
    roles(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
    ) @connection(key: "Pagination_roles") {
      edges {
        node {
          ...RoleLine_node
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

const RolesLines: FunctionComponent<RolesLinesProps> = ({
  queryRef,
  dataColumns,
  paginationOptions,
  setNumberOfElements,
}) => {
  const { data, hasMore, loadMore, isLoadingMore } = usePreloadedPaginationFragment<
  RolesLinesPaginationQuery,
  RolesLines_data$key
  >({
    linesQuery: rolesLinesQuery,
    linesFragment: rolesLinesFragment,
    queryRef,
    nodePath: ['roles', 'edges'],
    setNumberOfElements,
  });
  return (
    <ListLinesContent
      initialLoading={!data}
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoadingMore}
      dataList={data?.roles?.edges ?? []}
      globalCount={data?.roles?.pageInfo?.globalCount ?? nbOfRowsToLoad}
      LineComponent={RoleLine}
      DummyLineComponent={RoleLineDummy}
      dataColumns={dataColumns}
      nbOfRowsToLoad={nbOfRowsToLoad}
      paginationOptions={paginationOptions}
    />
  );
};

export default RolesLines;
