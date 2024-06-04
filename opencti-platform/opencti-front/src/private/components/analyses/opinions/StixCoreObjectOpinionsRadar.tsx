import React, { FunctionComponent } from 'react';
import * as R from 'ramda';
import { graphql, usePreloadedQuery } from 'react-relay';
import { PreloadedQuery } from 'react-relay/relay-hooks/EntryPointTypes';
import { useTheme } from '@mui/material';
import Chart from '../../common/charts/Chart';
import { useFormatter } from '../../../../components/i18n';
import { radarChartOptions } from '../../../../utils/Charts';
import { generateGreenToRedColors } from '../../../../utils/Colors';
import { StixCoreObjectOpinionsRadarDistributionQuery } from './__generated__/StixCoreObjectOpinionsRadarDistributionQuery.graphql';
import useHelper from '../../../../utils/hooks/useHelper';
import useAuth from '../../../../utils/hooks/useAuth';
import ThemeDark from '../../../../components/ThemeDark';
import ThemeLight from '../../../../components/ThemeLight';

export const stixCoreObjectOpinionsRadarDistributionQuery = graphql`
  query StixCoreObjectOpinionsRadarDistributionQuery(
    $objectId: String
    $field: String!
    $operation: StatsOperation!
    $limit: Int
  ) {
    opinionsDistribution(
      objectId: $objectId
      field: $field
      operation: $operation
      limit: $limit
    ) {
      label
      value
      entity {
        ... on Identity {
          name
        }
        ... on Malware {
          name
        }
      }
    }
  }
`;

interface StixCoreObjectOpinionsRadarProps {
  queryRef: PreloadedQuery<StixCoreObjectOpinionsRadarDistributionQuery>
  height: number
  opinionOptions: { label: string, value: number }[]
}

const StixCoreObjectOpinionsRadar: FunctionComponent<
StixCoreObjectOpinionsRadarProps
> = ({
  queryRef,
  height,
  opinionOptions,
}) => {
  const { isFeatureEnable } = useHelper();
  const isMonochromeFeatureEnabled = isFeatureEnable('MONOCHROME_LABELS');
  const { me: { monochrome_labels } } = useAuth();
  const isMonochrome = isMonochromeFeatureEnabled && monochrome_labels;
  const { t_i18n } = useFormatter();
  const { palette: { mode } } = useTheme();
  const theme = mode === 'dark'
    ? ThemeDark()
    : ThemeLight();
  const { opinionsDistribution } = usePreloadedQuery<StixCoreObjectOpinionsRadarDistributionQuery>(
    stixCoreObjectOpinionsRadarDistributionQuery,
    queryRef,
  );

  const distributionData = R.indexBy(
    R.prop('label'),
    (opinionsDistribution || []).map((n) => ({
      ...n,
      label: n?.label.toLowerCase(),
    })),
  );
  const chartData = [
    {
      name: t_i18n('Opinions'),
      data: opinionOptions.map((m) => distributionData[m.label]?.value || 0),
    },
  ];
  const labels = opinionOptions.map((m) => m.label);
  const colors = isMonochrome
    ? Array(opinionOptions.length).fill(theme.palette.chip.main)
    : generateGreenToRedColors(opinionOptions.length);

  return (
    <Chart
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // Need to migrate Chart Charts.js file to TSX
      options={radarChartOptions(theme, labels, colors, true, true)}
      series={chartData}
      type="radar"
      width="100%"
      height={height}
    />
  );
};

export default StixCoreObjectOpinionsRadar;
