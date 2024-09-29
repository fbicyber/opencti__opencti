import React, { FunctionComponent } from 'react';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import WidgetNoData from '../../../../components/dashboard/WidgetNoData';
import AuditsWidgetMultiLines from '../../common/audits/AuditsWidgetMultiLines';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import { MetricsWeeklyQuery } from './__generated__/MetricsWeeklyQuery.graphql';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';
import { wauDataQuery } from './MetricsWeekly';
import { useFormatter } from '../../../../components/i18n';
/**
 * This file exports a graph widget showing unique user activity over a given
 * number of weeks. Defaults to a 6-week rolling range, monday start-of-week.
 */

const getWeekRangesVariables = (weekStartDay = 'Monday', numWeeks = 6) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  let diffToWeekStart;

  if (weekStartDay.toLowerCase() === 'sunday') {
    diffToWeekStart = dayOfWeek;
  } else {
    diffToWeekStart = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  }

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - diffToWeekStart);

  const results = [];

  for (let i = 0; i < numWeeks; i += 1) {
    const weekStart = new Date(startOfWeek);
    weekStart.setDate(startOfWeek.getDate() - (i * 7));

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    results[i] = {
      startDate: weekStart,
      endDate: weekEnd,
    };
  }

  return results;
};

type auditsDistributionParameter = {
  field: string,
  startDate: string,
  endDate: string,
};

interface MetricsWeeklyGraphComponentProps {
  queryRef: PreloadedQuery<MetricsWeeklyQuery>,
  dateRanges: auditsDistributionParameter[],
}

const MetricsWeeklyGraphComponent: FunctionComponent<
MetricsWeeklyGraphComponentProps
> = ({
  queryRef,
  dateRanges,
}) => {
  const data = usePreloadedQuery<MetricsWeeklyQuery>(
    wauDataQuery,
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
          name: t_i18n('Weekly activity count'),
          data: widgetData,
        }]}
        interval={'week'}
        withExport={false}
        readonly={false}
      />
    );
  }
  return <WidgetNoData />;
};

const MetricsWeeklyGraph = ({
  weeks = 6,
}) => {
  const distributionParameters: auditsDistributionParameter[] = [];

  const weeksDates = getWeekRangesVariables(undefined, weeks);

  for (const weekDatePair of weeksDates) {
    distributionParameters.push({
      field: 'user_id',
      startDate: weekDatePair.startDate.toISOString(),
      endDate: weekDatePair.endDate.toISOString(),
    });
  }

  const queryRef = useQueryLoading<MetricsWeeklyQuery>(
    wauDataQuery,
    { distributionParameters },
  );

  return queryRef ? (
    <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
      <MetricsWeeklyGraphComponent
        queryRef={queryRef}
        dateRanges={distributionParameters}
      />
    </React.Suspense>
  ) : (
    <Loader variant={LoaderVariant.inElement} />
  );
};

export default MetricsWeeklyGraph;
