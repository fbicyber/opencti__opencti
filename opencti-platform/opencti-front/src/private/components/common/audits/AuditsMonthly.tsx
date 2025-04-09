import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay';
import React, { FunctionComponent } from 'react';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';
import { AuditsMonthlyQuery } from './__generated__/AuditsMonthlyQuery.graphql';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import WidgetNoData from '../../../../components/dashboard/WidgetNoData';
import WidgetDifference from '../../../../components/dashboard/WidgetDifference';
import WidgetContainer from '../../../../components/dashboard/WidgetContainer';
import { useFormatter } from '../../../../components/i18n';

export const mauDataQuery = graphql`
  query AuditsMonthlyQuery (
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
        value
      }
    }
  }
`;

interface AuditsMonthlyComponentProps {
  queryRef: PreloadedQuery<AuditsMonthlyQuery>
}

const AuditsMonthlyComponent: FunctionComponent<AuditsMonthlyComponentProps> = ({
  queryRef,
}) => {
  const data = usePreloadedQuery<AuditsMonthlyQuery>(
    mauDataQuery,
    queryRef,
  );

  if (data) {
    // Previous period users, filtered to non-null users
    const previousData = data.auditsMultiDistribution
      ?.[0]?.data?.filter((user) => !!user) ?? [];
    // Current period users, filtered to non-null users
    const currentData = data.auditsMultiDistribution
      ?.[1]?.data?.filter((user) => !!user) ?? [];
    const previousCount = new Set(previousData.map((user) => user.label)).size;
    const currentCount = new Set(currentData.map((user) => user.label)).size;

    return (
      <WidgetDifference
        count={currentCount}
        change={currentCount - previousCount}
        interval="month"
      />
    );
  }
  return <WidgetNoData />;
};

const AuditsMonthly = ({
  height = 300,
  title = 'Monthly Active Users',
  variant = 'inLine',
}) => {
  const { t_i18n } = useFormatter();

  // Last period consists of two months ago to one month ago
  // Current period consists of one month ago to now
  const now = new Date();
  const lastPeriodStartDate = new Date(now);
  const lastPeriodEndDate = new Date(now);
  lastPeriodStartDate.setMonth(now.getMonth() - 2);
  lastPeriodEndDate.setMonth(now.getMonth() - 1);

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

  const queryRef = useQueryLoading<AuditsMonthlyQuery>(
    mauDataQuery,
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
          <AuditsMonthlyComponent queryRef={queryRef} />
        </React.Suspense>
      ) : (
        <Loader variant={LoaderVariant.inElement} />
      )}
    </WidgetContainer>
  );
};

export default AuditsMonthly;
