import React, { FunctionComponent } from 'react';
import Grid from '@mui/material/Grid';
import EnterpriseEdition from '@components/common/entreprise_edition/EnterpriseEdition';
import AuditsMultiLineChart from '@components/common/audits/AuditsMultiLineChart';
import AuditsHorizontalBars from '@components/common/audits/AuditsHorizontalBars';
import { graphql, useLazyLoadQuery } from 'react-relay';
import AuditsMonthly from '@components/common/audits/AuditsMonthly';
import AuditsMonthlyGraph from '@components/common/audits/AuditsMonthlyGraph';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { useFormatter } from '../../../../components/i18n';
import useEnterpriseEdition from '../../../../utils/hooks/useEnterpriseEdition';
import { SETTINGS_SECURITYACTIVITY } from '../../../../utils/hooks/useGranted';
import Security from '../../../../utils/Security';
import { dayStartDate, monthsAgo, now } from '../../../../utils/Time';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import AuditsNumber from '../../common/audits/AuditsNumber';
import AuditsDonut from '../../common/audits/AuditsDonut';
import AuditsRadar from '../../common/audits/AuditsRadar';
import AuditsList from '../../common/audits/AuditsList';
import { MetricsGetUserIdsQuery } from './__generated__/MetricsGetUserIdsQuery.graphql';
import AuditsTable from '../../common/audits/AuditsTable';
import { AuditsMonthlyProvider } from '../../common/audits/AuditsMonthlyContext';
import AuditsWeekly from '@components/common/audits/AuditsWeekly';
import { AuditsWeeklyProvider } from '../../common/audits/AuditsWeeklyContext';
import AuditsWeeklyGraph from '@components/common/audits/AuditsWeeklyGraph';


interface MetricsComponentProps {
  userIds: string[],
}

const MetricsComponent: FunctionComponent<MetricsComponentProps> = ({
  userIds,
}) => {
  const { t_i18n } = useFormatter();
  const isEnterpriseEdition = useEnterpriseEdition();

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
            />
          </Grid>
          <AuditsMonthlyProvider>
            <Grid item xs={2} marginTop={4}>
              <AuditsMonthly
                height={300}
                parameters={{
                  title: t_i18n('Monthly Active Users'),
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
                variant="inLine"
              />
            </Grid>
            <Grid item xs={4} marginTop={4}>
              <AuditsMonthlyGraph
                height={300}
                parameters={{
                  startDate: monthsAgo(5),
                  endDate: now(),
                  interval: 'month',
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
              />
            </Grid>
          </AuditsMonthlyProvider>
          <AuditsWeeklyProvider>
            <Grid item xs={2} marginTop={4}>
              <AuditsWeekly
                height={300}
                parameters={{
                  title: t_i18n('Weekly Active Users'),
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
                variant="inLine"
              />
            </Grid>
            <Grid item xs={4} marginTop={4}>
              <AuditsWeeklyGraph
                height={300}
                parameters={{
                  startDate: monthsAgo(1),
                  endDate: now(),
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
              />
            </Grid>
          </AuditsWeeklyProvider>
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
            />
          </Grid>
        </Grid>
      </div>
    </Security>
  );
};

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

const Metrics = () => {
  const data = useLazyLoadQuery<MetricsGetUserIdsQuery>(getUserIdsQuery, {});
  const userIds = data.users?.edges.map(({ node }) => node.id) ?? [];
  return (
    <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
      <MetricsComponent userIds={userIds} />
    </React.Suspense>
  );
};

export default Metrics;
