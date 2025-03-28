import React, { useContext } from 'react';
import { graphql } from 'react-relay';
import { QueryRenderer } from '../../../../relay/environment';
import { useFormatter } from '../../../../components/i18n';
import { monthsAgo, now } from '../../../../utils/Time';
import useGranted, { SETTINGS_SECURITYACTIVITY, SETTINGS_SETACCESSES, VIRTUAL_ORGANIZATION_ADMIN } from '../../../../utils/hooks/useGranted';
import useEnterpriseEdition from '../../../../utils/hooks/useEnterpriseEdition';
import { removeEntityTypeAllFromFilterGroup } from '../../../../utils/filters/filtersUtils';
import WidgetContainer from '../../../../components/dashboard/WidgetContainer';
import WidgetNoData from '../../../../components/dashboard/WidgetNoData';
import WidgetMultiLines from '../../../../components/dashboard/WidgetMultiLines';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import { AuditsMonthlyContext } from './AuditsMonthlyContext';

const auditsMonthlyGraphQuery = graphql`
  query AuditsMonthlyGraphQuery(
    $operation: StatsOperation!
    $startDate: DateTime!
    $endDate: DateTime!
    $interval: String!
    $timeSeriesParameters: [AuditsTimeSeriesParameters]
  ) {
    auditsMultiTimeSeries(
      operation: $operation
      startDate: $startDate
      endDate: $endDate
      interval: $interval
      timeSeriesParameters: $timeSeriesParameters
    ) {
      data {
        date
        value
      }
    }
  }
`;

const AuditsMonthlyGraph = ({
  variant,
  height,
  dataSelection,
  parameters = {},
  withExportPopover = false,
  isReadOnly = false,
}) => {
  const { t_i18n } = useFormatter();
  const isGrantedToSettings = useGranted([SETTINGS_SETACCESSES, SETTINGS_SECURITYACTIVITY, VIRTUAL_ORGANIZATION_ADMIN]);
  const isEnterpriseEdition = useEnterpriseEdition();

  const { loginCount } = useContext(AuditsMonthlyContext);
  const renderContent = () => {
    if (!isGrantedToSettings || !isEnterpriseEdition) {
      return (
        <div style={{ display: 'table', height: '100%', width: '100%' }}>
          <span
            style={{
              display: 'table-cell',
              verticalAlign: 'middle',
              textAlign: 'center',
            }}
          >
            {!isEnterpriseEdition
              ? t_i18n(
                'This feature is only available in OpenCTI Enterprise Edition.',
              )
              : t_i18n('You are not authorized to see this data.')}
          </span>
        </div>
      );
    }

    const timeSeriesParameters = dataSelection.map((selection) => ({
      field: selection.date_attribute?.length > 0 ? selection.date_attribute : 'timestamp',
      types: ['History', 'Activity'],
      filters: removeEntityTypeAllFromFilterGroup(selection.filters),
    }));

    return (
      <QueryRenderer
        query={auditsMonthlyGraphQuery}
        variables={{
          operation: 'count',
          startDate: monthsAgo(6),
          endDate: now(),
          interval: 'month',
          timeSeriesParameters,
        }}
        render={({ props }) => {
          if (props && props.auditsMultiTimeSeries) {
            return (
              <WidgetMultiLines
                series={dataSelection.map((selection, i) => {
                  const seriesData = props.auditsMultiTimeSeries[i]?.data.map((entry) => ({
                    x: new Date(entry.date).toLocaleString('en-US', { month: 'short', year: 'numeric' }),
                    y: entry.value,
                  })) || [];

                  const currentMonth = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });

                  const existingCurrentMonthData = seriesData.find((point) => point.x === currentMonth);

                  if (!existingCurrentMonthData) {
                    const currentMonthLoginCount = props.auditsMultiTimeSeries[i]?.data
                      .filter((entry) => new Date(entry.date).getMonth() === new Date().getMonth())
                      .reduce((sum, entry) => sum + entry.value, loginCount);

                    console.log("currentMonthLoginCount: " + currentMonthLoginCount);
                    console.log("loginCount: " + loginCount);

                    seriesData.push({ x: currentMonth, y: currentMonthLoginCount });
                  }

                  return {
                    name: selection.label || t_i18n('Monthly activity count'),
                    data: seriesData,
                  };
                })}
                interval={'month'}
                hasLegend={parameters.legend}
                withExport={withExportPopover}
                readonly={isReadOnly}
              />
            );
          }
          if (props) {
            return <WidgetNoData />;
          }
          return <Loader variant={LoaderVariant.inElement} />;
        }}
      />
    );
  };
  return (
    <WidgetContainer
      height={height}
      title={parameters.title ?? t_i18n('Monthly Activity')}
      variant={variant}
    >
      {renderContent()}
    </WidgetContainer>
  );
};

export default AuditsMonthlyGraph;
