import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay';
import React, { FunctionComponent, useMemo } from 'react';
import { parseISO, differenceInDays } from 'date-fns';
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

export const metricsRetentionQuarterDataQuery = graphql`
  query MetricsRetentionQuarterQuery(
    $distributionParameters: [auditsDistributionParameters]
  ) {
    auditsMultiDistribution(
      dateAttribute: ""
      operation: count
      types: ["History", "Activity"]
      distributionParameters: $distributionParameters
    ) {
      data {
        user {
          id
          created_at
          last_login
          login_count
        }
      }
    }
  }
`;

interface RetentionQuarterComponentProps {
  queryRef: PreloadedQuery<MetricsRetentionQuarterQuery>;
}

interface MetricsRetentionQuarterProps {
  variant: string,
  endDate: string | null,
  startDate: string | null,
  parameters: {
    title?: string;
  }
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

const MetricsRetentionQuarterComponent: FunctionComponent<RetentionQuarterComponentProps> = ({ queryRef }) => {
  const data = usePreloadedQuery<MetricsRetentionQuarterQuery>(MetricsRetentionQuarterQuery, queryRef);
  const now = new Date();

  const retention3m = useMemo(() => {
    if (!data?.auditsMultiDistribution?.data) return 0;

    const users = data.auditsMultiDistribution.data.map((d: { user: any; }) => d.user).filter(Boolean);

    const eligible = users.filter(u => {
      if (!u.created_at || !u.last_login || u.login_count == null) return false;
      const accountAge = differenceInDays(now, parseISO(u.created_at));
      const lastLoginDays = differenceInDays(now, parseISO(u.lastLogin));
      return accountAge >= 30 && lastLoginDays <= 30 && u.login_count > 1;
    });

    return users.length > 0 ? Math.round((eligible.length / users.length) * 100) : 0;
  }, [data, now]);

  return data ? (
    <div style={{ textAlign: 'center', fontSize: '1.5em', fontWeight: 'bold' }}>
      3-Month Retention: {retention3m}%
    </div>
  ) : (
    <WidgetNoData />
  );
};

const MetricsRetentionQuarter: React.FC<MetricsRetentionQuarterProps> = ({
  parameters,
  variant,
  endDate,
  startDate,
  dataSelection
}) => {
  const { t_i18n } = useFormatter();
  const height = 300;
  const filters = convertToRelayFilterGroup(dataSelection?.[0]?.filters);

  const now = new Date();
  now.setHours(23, 59, 59, 999);

  const start = startDate ? new Date(startDate) : new Date(now);
  start.setMonth(now.getMonth() - 6);
  const end = endDate ? new Date(endDate) : now;

  const distributionParameters: MetricsRetentionQuarterQuery$variables['distributionParameters'] = [
    {
      field: 'user_id',
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      filters,
    },
  ];

  const queryRef = useQueryLoading<MetricsRetentionQuarterQuery>(metricsRetentionQuarterDataQuery, {
    distributionParameters,
  });

  return (
    <WidgetContainer
      height={height}
      title={t_i18n(parameters?.title?.trim()) ?? t_i18n('3-Month Retention')}
      variant={variant}
    >
      {queryRef ? (
        <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
          <MetricsRetentionQuarterComponent queryRef={queryRef} />
        </React.Suspense>
      ) : (
        <Loader variant={LoaderVariant.inElement} />
      )}
    </WidgetContainer>
  );
};

export default MetricsRetentionQuarter;
