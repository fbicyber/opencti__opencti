import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import React, { FunctionComponent } from 'react';
import AuditsWidgetMultiLines from '../../common/audits/AuditsWidgetMultiLines';
import { FilterGroup, MetricsMonthlyQuery } from './__generated__/MetricsMonthlyQuery.graphql';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';
import { mauDataQuery } from './MetricsMonthly';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import WidgetNoData from '../../../../components/dashboard/WidgetNoData';
import { useFormatter } from '../../../../components/i18n';

/**
 * This file exports a graph widget showing unique user activity over a given
 * number of months. Defaults to a 6-month rolling range.
 */

type auditsDistributionParameter = {
  field: string,
  startDate: string,
  endDate: string,
};

interface MetricsMonthlyGraphComponentProps {
  queryRef: PreloadedQuery<MetricsMonthlyQuery>,
  dateRanges: auditsDistributionParameter[],
}

const MetricsMonthlyGraphComponent: FunctionComponent<
MetricsMonthlyGraphComponentProps
> = ({
  queryRef,
  dateRanges,
}) => {
  const data = usePreloadedQuery<MetricsMonthlyQuery>(
    mauDataQuery,
    queryRef,
  );

  const { t_i18n } = useFormatter();

  if (data.auditsMultiDistribution) {
    // Create the series data for the graph widget
    const widgetData = data.auditsMultiDistribution.map((selection, i: number) => ({
      x: dateRanges[i].startDate,
      y: selection?.data?.length ?? 0,
    }));

    return (
      <AuditsWidgetMultiLines
        series={[{
          name: t_i18n('Monthly activity count'),
          data: widgetData,
        }]}
        interval={'month'}
        withExport={false}
        readonly={false}
      />
    );
  }
  return <WidgetNoData />;
};

const MetricsMonthlyGraph = ({
  months = 6,
}) => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const distributionParameters: auditsDistributionParameter[] = [];

  // Create rolling date ranges for specified number of months
  for (let i = months; i > 0; i -= 1) {
    // Since setMonth modifies in place, create new Dates from `now`
    const startDate = new Date(now);
    const endDate = new Date(now);

    // Date range is `i` months ago to `i+1` months ago
    startDate.setMonth(now.getMonth() - i);
    endDate.setMonth(now.getMonth() - i + 1);

    const filters: FilterGroup = {
      mode: 'and',
      filters: [
        {
          key: ['event_scope'],
          values: ['login', 'logout'],
          operator: 'not_eq',
        },
      ],
      filterGroups: [],
    };

    distributionParameters.push({
      field: 'user_id',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  const queryRef = useQueryLoading<MetricsMonthlyQuery>(
    mauDataQuery,
    { distributionParameters },
  );

  return queryRef ? (
    <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
      <MetricsMonthlyGraphComponent
        queryRef={queryRef}
        dateRanges={distributionParameters}
      />
    </React.Suspense>
  ) : (
    <Loader variant={LoaderVariant.inElement} />
  );
};

export default MetricsMonthlyGraph;
