import React, { FunctionComponent } from 'react';
import Grid from '@mui/material/Grid';
import EnterpriseEdition from '@components/common/entreprise_edition/EnterpriseEdition';
import AuditsMultiLineChart from '@components/common/audits/AuditsMultiLineChart';
import AuditsHorizontalBars from '@components/common/audits/AuditsHorizontalBars';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { useFormatter } from '../../../../components/i18n';
import useEnterpriseEdition from '../../../../utils/hooks/useEnterpriseEdition';
import { SETTINGS_SECURITYACTIVITY } from '../../../../utils/hooks/useGranted';
import Security from '../../../../utils/Security';
import { monthsAgo } from '../../../../utils/Time';
import Loader, { LoaderVariant } from '../../../../components/Loader';

const MetricsComponent: FunctionComponent = () => {
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
        <Grid container={true} spacing={3}>
          <Grid item xs={6}>
            <AuditsMultiLineChart
              height={300}
              // startDate={monthsAgo(1)} // need to convert AuditsMultiLineChart from .jsx to .tsx component in order to pass prop..?
                                          // currently getting "cannot assign string to type 'null | undefined'"
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
                        values: ['88ec0c6a-13ce-5e39-b486-354fe4a7084f', '2be77d63-0137-4e6e-9664-5281463e226b'], // hard-coded admin & test-user ids for my local instance
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
                        values: ['88ec0c6a-13ce-5e39-b486-354fe4a7084f', '2c821418-98f1-4194-bd63-592a0d9a3500'], // hard-coded
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
        </Grid>
      </div>
    </Security>
  );
};

const Metrics = () => {
  return (
    <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
      <MetricsComponent />
    </React.Suspense>
  );
};

export default Metrics;
