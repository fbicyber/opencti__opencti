import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import React, { FunctionComponent } from 'react';
import AuditsWidgetMultiLines from './AuditsWidgetMultiLines';
import { AuditsMonthlyQuery } from './__generated__/AuditsMonthlyQuery.graphql';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';
import { mauDataQuery } from './AuditsMonthly';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import WidgetNoData from '../../../../components/dashboard/WidgetNoData';

/**
 * This file exports a graph widget showing unique user activity over a given
 * number of months. Defaults to a 6-month rolling range.
 */

type auditsDistributionParameter = {
  field: string,
  startDate: string,
  endDate: string,
};

interface AuditsMonthlyGraphComponentProps {
  queryRef: PreloadedQuery<AuditsMonthlyQuery>,
  dateRanges: auditsDistributionParameter[],
}

const AuditsMonthlyGraphComponent: FunctionComponent<
AuditsMonthlyGraphComponentProps
> = ({
  queryRef,
  dateRanges,
}) => {
  const data = usePreloadedQuery<AuditsMonthlyQuery>(
    mauDataQuery,
    queryRef,
  );

  if (data.auditsMultiDistribution) {
    // Create the series data for the graph widget
    const widgetData = data.auditsMultiDistribution.map((selection, i) => ({
      x: dateRanges[i].startDate,
      y: selection?.data?.length ?? 0,
    }));

    return (
      <AuditsWidgetMultiLines
        series={[{ data: widgetData }]}
        interval={'month'}
        withExport={false}
        readonly={false}
      />
    );
  }
  return <WidgetNoData />;
};

const AuditsMonthlyGraph = ({
  months = 6,
}) => {
  const now = new Date();
  const distributionParameters: auditsDistributionParameter[] = [];

  // Create rolling date ranges for specified number of months
  for (let i = months; i > 0; i -= 1) {
    // Since setMonth modifies in place, create new Dates from `now`
    const startDate = new Date(now);
    const endDate = new Date(now);

    // Date range is `i` months ago to `i+1` months ago
    startDate.setMonth(now.getMonth() - i);
    endDate.setMonth(now.getMonth() - i + 1);

    distributionParameters.push({
      field: 'user_id',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  const queryRef = useQueryLoading<AuditsMonthlyQuery>(
    mauDataQuery,
    { distributionParameters },
  );

  return queryRef ? (
    <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
      <AuditsMonthlyGraphComponent
        queryRef={queryRef}
        dateRanges={distributionParameters}
      />
    </React.Suspense>
  ) : (
    <Loader variant={LoaderVariant.inElement} />
  );
};

export default AuditsMonthlyGraph;
