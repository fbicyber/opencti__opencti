import React, { FunctionComponent } from 'react';
import { graphql, PreloadedQuery } from 'react-relay';
import { SectorsLinesPaginationQuery, SectorsLinesPaginationQuery$variables } from '@components/entities/sectors/__generated__/SectorsLinesPaginationQuery.graphql';
import { SectorsLines_data$key } from './__generated__/SectorsLines_data.graphql';
import ListLinesContent from '../../../../components/list_lines/ListLinesContent';
import { SectorLine, SectorLineDummy } from './SectorLine';
import { DataColumns } from '../../../../components/list_lines';
import { HandleAddFilter, UseLocalStorageHelpers } from '../../../../utils/hooks/useLocalStorage';
import usePreloadedPaginationFragment from '../../../../utils/hooks/usePreloadedPaginationFragment';

const nbOfRowsToLoad = 50;

interface SectorsLinesProps {
  queryRef: PreloadedQuery<SectorsLinesPaginationQuery>;
  dataColumns: DataColumns;
  paginationOptions?: SectorsLinesPaginationQuery$variables;
  setNumberOfElements: UseLocalStorageHelpers['handleSetNumberOfElements'];
  onLabelClick: HandleAddFilter;
}

export const sectorsLinesQuery = graphql`
    query SectorsLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: SectorsOrdering
    $filters: FilterGroup
    ) {
        ...SectorsLines_data
        @arguments(
         search: $search
         count: $count
         cursor: $cursor
         orderBy: $orderBy
         filters: $filters
        )
    }
`;

export const sectorsLinesFragment = graphql`
  fragment SectorsLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "SectorsOrdering", defaultValue: name }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "SectorsLinesRefetchQuery") {
    sectors(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      filters: $filters
    ) @connection(key: "Pagination_sectors") {
      edges {
        node {
          id
          name
          description
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

const SectorsLines: FunctionComponent<SectorsLinesProps> = ({
  setNumberOfElements,
  queryRef,
  dataColumns,
  paginationOptions,
  onLabelClick,
}) => {
  const { data, hasMore, loadMore, isLoadingMore } = usePreloadedPaginationFragment<
  SectorsLinesPaginationQuery,
  SectorsLines_data$key
  >({
    linesQuery: sectorsLinesQuery,
    linesFragment: sectorsLinesFragment,
    queryRef,
    nodePath: ['sectors', 'pageInfo', 'globalCount'],
    setNumberOfElements,
  });

  return (
    <ListLinesContent
      initialLoading={!data}
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoadingMore}
      dataList={data?.sectors?.edges ?? []}
      globalCount={
            data?.sectors?.pageInfo?.globalCount ?? nbOfRowsToLoad
          }
      LineComponent={SectorLine}
      DummyLineComponent={SectorLineDummy}
      dataColumns={dataColumns}
      nbOfRowsToLoad={nbOfRowsToLoad}
      paginationOptions={paginationOptions}
      onLabelClick={onLabelClick}
    />
  );
};

export default SectorsLines;
