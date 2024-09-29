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
import { dayStartDate, monthsAgo } from '../../../../utils/Time';
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
        <div className={classes.container}>
          <ActivityMenu />
          <Breadcrumbs variant="object" elements={[{ label: t_i18n('Settings') }, { label: t_i18n('Metrics'), current: true }]} />
          <Grid container={true} spacing={3}>
            <Grid
                container
                rowSpacing={5}
                columnSpacing={2}
                classes={{ container: classes.gridContainer }}
            >
                <Grid item xs={6}>
                    <Paper classes={{ root: classes.paper }} variant="outlined">

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
                                    values: ["88ec0c6a-13ce-5e39-b486-354fe4a7084f", "2be77d63-0137-4e6e-9664-5281463e226b"], // hard-coded admin & test-user ids for my local instance
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
                    </Paper>
                </Grid>
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
