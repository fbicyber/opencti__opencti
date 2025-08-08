import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay';
import React, { FunctionComponent } from 'react';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';
import {
  FilterGroup as RelayFilterGroup,
  Filter as RelayFilter,
  MetricsRetentionQuarterQuery,
  MetricsRetentionQuarterQuery$variables,
} from './__generated__/MetricsRetentionQuarterQuery.graphql';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import WidgetNoData from '../../../../components/dashboard/WidgetNoData';
import WidgetContainer from '../../../../components/dashboard/WidgetContainer';
import { useFormatter } from '../../../../components/i18n';
import { metricsGraphqlQueryUser } from './metrics.d';

export const metricsRetentionQuarterQuery = graphql`
  query MetricsRetentionQuarterQuery (
    $numeratorParameters: [auditsDistributionParameters]
    $denominatorParameters: [auditsDistributionParameters]
  ) {
    numerator: auditsMultiDistribution(
      dateAttribute: ""
      operation: count
      types: ["History", "Activity"]
      distributionParameters: $numeratorParameters
    ) {
      data {
        label
      }
    }
    denominator: auditsMultiDistribution(
      dateAttribute: ""
      operation: count
      types: ["History", "Activity"]
      distributionParameters: $denominatorParameters
    ) {
      data {
        label
      }
    }
  }
`;

interface MetricsRetentionQuarterComponentProps {
  queryRef: PreloadedQuery<MetricsRetentionQuarterQuery>
}

interface MetricsRetentionQuarterProps {
  variant: string;
  endDate: string | null;
  startDate: string | null;
  parameters: {
    title?: string;
  };
  dataSelection?: {
    filters?: unknown;
  }[];
}

function convertToRelayFilterGroup(input?: any): RelayFilterGroup | undefined {
  if (!input) return undefined;
  return {
    mode: input.mode,
    filters: input.filters.map((f: { key: any; values: any }) => ({
      ...f,
      key: Array.isArray(f.key) ? f.key : [f.key],
      values: f.values,
    })) as readonly RelayFilter[],
    filterGroups: input.filterGroups ?? [],
  };
}

const RetentionMonthlyComponent: FunctionComponent<MetricsRetentionQuarterComponentProps> = ({
  queryRef,
}) => {
  const { t_i18n } = useFormatter();
  const data = usePreloadedQuery<MetricsRetentionQuarterQuery>(
    metricsRetentionQuarterQuery,
    queryRef,
  );

  if (data) {
    // Users who logged in within the last 30 days
    const numeratorData = data.numerator
      ?.[0]?.data?.filter((user: metricsGraphqlQueryUser) => !!user) ?? [];
    // Users with accounts >= 90 days old and at least one login
    const denominatorData = data.denominator
      ?.[0]?.data?.filter((user: metricsGraphqlQueryUser) => !!user) ?? [];

    const numeratorCount = new Set(numeratorData.map((user: metricsGraphqlQueryUser) => user?.label)).size;
    const denominatorCount = new Set(denominatorData.map((user: metricsGraphqlQueryUser) => user?.label)).size;

    // Calculate retention rate (avoid division by zero)
    const retentionRate = denominatorCount > 0 ? (numeratorCount / denominatorCount) * 100 : 0;

    return (
      <WidgetContainer
        height={300}
        title={t_i18n('Monthly Retention Rate')}
        variant="inElement"
      >
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h3>{retentionRate.toFixed(2)}%</h3>
          <p>
            {t_i18n('Retention Rate')}: {numeratorCount} / {denominatorCount} {t_i18n('users')}
          </p>
        </div>
      </WidgetContainer>
    );
  }
  return <WidgetNoData />;
};

const RetentionMonthly: React.FC<MetricsRetentionQuarterProps> = ({
  parameters,
  variant,
  endDate,
  startDate,
  dataSelection,
}) => {
  const { t_i18n } = useFormatter();
  const height = 300;
  const filters = convertToRelayFilterGroup(dataSelection?.[0]?.filters);

  // Define time periods
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  // Last 30 days for numerator
  const numeratorEnd = endDate ? new Date(endDate) : now;
  const numeratorStart = new Date(numeratorEnd);
  numeratorStart.setDate(numeratorEnd.getDate() - 30);

  // Accounts created at least 90 days ago for denominator
  const denominatorEnd = startDate ? new Date(startDate) : now;
  const denominatorStart = new Date(denominatorEnd);
  denominatorStart.setDate(denominatorEnd.getDate() - 90);

  // Query parameters for numerator and denominator
  const numeratorParameters: MetricsRetentionQuarterQuery$variables['numeratorParameters'] = [
    {
      field: 'user_id',
      startDate: numeratorStart.toISOString(),
      endDate: numeratorEnd.toISOString(),
      filters,
    },
  ];

  const denominatorParameters: MetricsRetentionQuarterQuery$variables['denominatorParameters'] = [
    {
      field: 'user_id',
      startDate: denominatorStart.toISOString(),
      endDate: denominatorEnd.toISOString(),
      filters,
    },
  ];

  const queryRef = useQueryLoading<MetricsRetentionQuarterQuery>(
    metricsRetentionQuarterQuery,
    { numeratorParameters, denominatorParameters },
  );

  return (
    <WidgetContainer
      height={height}
      title={t_i18n(parameters?.title?.trim()) ?? t_i18n('Quarter Retention Rate')}
      variant={variant}
    >
      {queryRef ? (
        <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
          <RetentionMonthlyComponent queryRef={queryRef} />
        </React.Suspense>
      ) : (
        <Loader variant={LoaderVariant.inElement} />
      )}
    </WidgetContainer>
  );
};

export default RetentionMonthly;
