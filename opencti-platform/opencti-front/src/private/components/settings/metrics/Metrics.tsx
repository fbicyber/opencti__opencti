import React, { FunctionComponent } from 'react';
import Grid from '@mui/material/Grid';
import EnterpriseEdition from '@components/common/entreprise_edition/EnterpriseEdition';
import AuditsMultiLineChart from '@components/common/audits/AuditsMultiLineChart';
import AuditsHorizontalBars from '@components/common/audits/AuditsHorizontalBars';
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay';
import MetricsWeekly from './MetricsWeekly';
import MetricsWeeklyGraph from './MetricsWeeklyGraph';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { useFormatter } from '../../../../components/i18n';
import useEnterpriseEdition from '../../../../utils/hooks/useEnterpriseEdition';
import { SETTINGS_SECURITYACTIVITY } from '../../../../utils/hooks/useGranted';
import Security from '../../../../utils/Security';
import { monthsAgo } from '../../../../utils/Time';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import AuditsDonut from '../../common/audits/AuditsDonut';
import AuditsRadar from '../../common/audits/AuditsRadar';
import AuditsList from '../../common/audits/AuditsList';
import { MetricsGetUserIdsQuery } from './__generated__/MetricsGetUserIdsQuery.graphql';
import AuditsTable from '../../common/audits/AuditsTable';
import MetricsMonthlyGraph from './MetricsMonthlyGraph';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';
import MetricsMonthly from './MetricsMonthly';

const getUserIdsQuery = graphql`
  query MetricsGetUserIdsQuery {
    users {
      edges {
        node {
          id
        }
      }
    }
  }
`;

interface MetricsComponentProps {
  queryRef: PreloadedQuery<MetricsGetUserIdsQuery>
}

const MetricsComponent: FunctionComponent<MetricsComponentProps> = ({
  queryRef,
}) => {
  const { t_i18n } = useFormatter();
  const isEnterpriseEdition = useEnterpriseEdition();

  const data = usePreloadedQuery<MetricsGetUserIdsQuery>(
    getUserIdsQuery,
    queryRef,
  );
  const userIds = data.users?.edges.map(({ node }) => node.id) ?? [];

  if (!isEnterpriseEdition) {
    return <EnterpriseEdition feature={'User activity'} />;
  }
  return (
    <Security needs={[SETTINGS_SECURITYACTIVITY]} placeholder={<span>{t_i18n(
      'You do not have any access to the platform metrics of this OpenCTI instance.',
    )}</span>}
    >
      <div style={{
        margin: 0,
      }}
      >
        <Breadcrumbs elements={[{ label: t_i18n('Settings') }, { label: t_i18n('Metrics'), current: true }]} />
        <Grid container={true} spacing={3} marginBottom={5}>
          <Grid item xs={6}>
            <AuditsMultiLineChart
              height={300}
              parameters={{
                title: t_i18n('Logins to the platform'),
                startDate: monthsAgo(1),
              }}
              dataSelection={[
                {
                  date_attribute: 'created_at',
                  filters: {
                    mode: 'and',
                    filters: [
                      {
                        key: 'members_user',
                        values: userIds,
                      },
                      {
                        key: 'event_scope',
                        values: ['login'],
                      },
                    ],
                    filterGroups: [],
                  },
                },
              ]}
              variant={undefined}
              startDate={undefined}
              endDate={undefined}
            />
          </Grid>
          <Grid item xs={6}>
            <AuditsHorizontalBars
              height={300}
              parameters={{
                title: 'Last 12 months of logins by user',
                startDate: monthsAgo(1),
              }}
              dataSelection={[
                {
                  attribute: 'user_id',
                  date_attribute: 'created',
                  filters: {
                    mode: 'and',
                    filters: [
                      {
                        key: 'members_user',
                        values: userIds,
                      },
                      {
                        key: 'event_scope',
                        values: ['login'],
                      },
                    ],
                    filterGroups: [],
                  },
                  number: 20,
                },
              ]}
              variant={undefined}
              startDate={undefined}
              endDate={undefined}
            />
          </Grid>
          <Grid item xs={2} marginTop={4}>
            <MetricsMonthly />
          </Grid>
          <Grid item xs={4} marginTop={4}>
            <MetricsMonthlyGraph />
          </Grid>
          <Grid item xs={2} marginTop={4}>
            <MetricsWeekly />
          </Grid>
          <Grid item xs={4} marginTop={4}>
            <MetricsWeeklyGraph />
          </Grid>
          <Grid item xs={4} marginTop={4}>
            <AuditsTable
              height={350}
              parameters={{
                title: t_i18n('Top global search keywords'),
              }}
              dataSelection={[
                {
                  attribute: 'context_data.search',
                  date_attribute: 'created_at',
                  number: 30,
                  filters: {
                    mode: 'and',
                    filters: [
                      {
                        key: 'members_user',
                        values: userIds,
                      },
                    ],
                    filterGroups: [],
                  },
                },
              ]}
            />
          </Grid>
          <Grid item xs={4} marginTop={4}>
            <AuditsDonut
              height={350}
              parameters={{
                title: t_i18n('Top events'),
              }}
              dataSelection={[
                {
                  attribute: 'event_scope',
                  date_attribute: 'created_at',
                  number: 10,
                  filters: {
                    mode: 'and',
                    filters: [
                      {
                        key: 'members_user',
                        values: userIds,
                      },
                      {
                        key: 'entity_type',
                        values: ['History'],
                      },
                    ],
                    filterGroups: [],
                  },
                },
              ]}
            />
          </Grid>
          <Grid item xs={4} marginTop={4}>
            <AuditsRadar
              height={350}
              parameters={{
                title: t_i18n('Top authors of read and exported entities'),
              }}
              dataSelection={[
                {
                  attribute: 'context_data.created_by_ref_id',
                  date_attribute: 'created_at',
                  filters: {
                    mode: 'and',
                    filters: [
                      {
                        key: 'members_user',
                        values: userIds,
                      },
                      {
                        key: 'event_scope',
                        values: ['export', 'read'],
                        operator: 'eq',
                        mode: 'or',
                      },
                    ],
                    filterGroups: [],
                  },
                },
              ]}
              variant={undefined}
              startDate={undefined}
              endDate={undefined}
            />
          </Grid>
          <Grid item xs={8} marginTop={4}>
            <AuditsList
              height={350}
              parameters={{
                title: t_i18n('Latest exports'),
              }}
              dataSelection={[
                {
                  date_attribute: 'created_at',
                  filters: {
                    mode: 'and',
                    filters: [
                      {
                        key: 'members_user',
                        values: userIds,
                      },
                      {
                        key: 'event_scope',
                        values: ['export'],
                      },
                    ],
                    filterGroups: [],
                  },
                },
              ]}
              variant={undefined}
              startDate={undefined}
              endDate={undefined}
            />
          </Grid>
          <Grid item xs={4} marginTop={4}>
            <AuditsHorizontalBars
              height={350}
              parameters={{
                title: t_i18n('Top read or exported entities'),
              }}
              dataSelection={[
                {
                  attribute: 'context_data.id',
                  filters: {
                    mode: 'and',
                    filters: [
                      {
                        key: 'members_user',
                        values: userIds,
                      },
                      {
                        key: 'event_scope',
                        values: ['export', 'read'],
                        operator: 'eq',
                        mode: 'or',
                      },
                    ],
                    filterGroups: [],
                  },
                  number: 20,
                },
              ]}
              variant={undefined}
              startDate={undefined}
              endDate={undefined}
            />
          </Grid>
        </Grid>
      </div>
    </Security>
  );
};

const Metrics = () => {
  const queryRef = useQueryLoading<MetricsGetUserIdsQuery>(getUserIdsQuery, {});
  return queryRef ? (
    <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
      <MetricsComponent queryRef={queryRef} />
    </React.Suspense>
  ) : (
    <Loader variant={LoaderVariant.inElement} />
  );
};

export default Metrics;
