import React, { FunctionComponent } from 'react';
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay';
import WidgetContainer from '../../../../components/dashboard/WidgetContainer';
import WidgetNoData from '../../../../components/dashboard/WidgetNoData';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import WidgetDifference from '../../../../components/dashboard/WidgetDifference';
import { useFormatter } from '../../../../components/i18n';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';
import { MetricsWeeklyQuery } from './__generated__/MetricsWeeklyQuery.graphql';
import { metricsGraphqlQueryUser } from './metrics.d';

export const wauDataQuery = graphql`
  query MetricsWeeklyQuery (
    $distributionParameters: [auditsDistributionParameters]
  ) {
    auditsMultiDistribution(
      dateAttribute: ""
      operation: count
      types: ["History", "Activity"]
      distributionParameters: $distributionParameters
    ) {
      data {
        label
      }
    }
  }
`;

interface MetricsWeeklyComponentProps {
  queryRef: PreloadedQuery<MetricsWeeklyQuery>
}

const MetricsWeeklyComponent: FunctionComponent<MetricsWeeklyComponentProps> = ({
  queryRef,
}) => {
  const data = usePreloadedQuery<MetricsWeeklyQuery>(
    wauDataQuery,
    queryRef,
  ); if (data) {
    // Previous period users, filtered to non-null users
    const previousData = data.auditsMultiDistribution
      ?.[0]?.data?.filter((user: metricsGraphqlQueryUser) => !!user) ?? [];
    // Current period users, filtered to non-null users
    const currentData = data.auditsMultiDistribution
      ?.[1]?.data?.filter((user: metricsGraphqlQueryUser) => !!user) ?? [];
    const previousCount = new Set(previousData.map((user: metricsGraphqlQueryUser) => user?.label)).size;
    const currentCount = new Set(currentData.map((user: metricsGraphqlQueryUser) => user?.label)).size;

    return (
      <WidgetDifference
        count={currentCount}
        change={currentCount - previousCount}
        interval="week"
      />
    );
  }
  return <WidgetNoData />;
};

const MetricsWeekly = ({
  height = 300,
  title = 'Weekly Active Users',
  variant = 'inLine',
}) => {
  const { t_i18n } = useFormatter();

  // Current period consists of most recent Monday to now
  // Last period is two Mondays ago to the most recent Monday
  // This is so the number widget aligns with the WAU graph
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const diffToWeekStart = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - diffToWeekStart);

  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const lastPeriodEndDate = new Date(startOfWeek);
  const lastPeriodStartDate = new Date(startOfWeek);
  lastPeriodStartDate.setDate(lastPeriodStartDate.getDate() - 7);

  // Get the user logins for last month and this current month
  const distributionParameters = [
    {
      field: 'user_id',
      startDate: lastPeriodStartDate.toISOString(),
      endDate: lastPeriodEndDate.toISOString(),
    },
    {
      field: 'user_id',
      startDate: lastPeriodEndDate.toISOString(),
      endDate: now.toISOString(),
    },
  ];

  const queryRef = useQueryLoading<MetricsWeeklyQuery>(
    wauDataQuery,
    { distributionParameters },
  );

  return (
    <WidgetContainer
      height={height}
      title={t_i18n(title)}
      variant={variant}
    >
      {queryRef ? (
        <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
          <MetricsWeeklyComponent queryRef={queryRef} />
        </React.Suspense>
      ) : (
        <Loader variant={LoaderVariant.inElement} />
      )}
    </WidgetContainer>
  );
};

export default MetricsWeekly;
