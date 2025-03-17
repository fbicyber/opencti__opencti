/*
Copyright (c) 2021-2024 Filigran SAS

This file is part of the OpenCTI Enterprise Edition ("EE") and is
licensed under the OpenCTI Enterprise Edition License (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://github.com/OpenCTI-Platform/opencti/blob/master/LICENSE

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*/

import React, { FunctionComponent } from 'react';
import Grid from '@mui/material/Grid';
import EnterpriseEdition from '@components/common/entreprise_edition/EnterpriseEdition';
import AuditsMultiLineChart from '@components/common/audits/AuditsMultiLineChart';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import ActivityMenu from '../ActivityMenu';
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
        padding: '0 200px 50px 0',
      }}
      >
        <ActivityMenu />
        <Breadcrumbs elements={[{ label: t_i18n('Settings') }, { label: t_i18n('Metrics'), current: true }]} />
        <Grid container={true} spacing={3}>
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
        </Grid>
      </div>
    </Security>

  );
};

const Metrics = () => {
//   const queryRef = useQueryLoading<ConfigurationQuery>(configurationQuery, {});
//   return queryRef ? (
  return (
    <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
      <MetricsComponent />
      {/* queryRef={queryRef} */}
    </React.Suspense>
  );
};

export default Metrics;
