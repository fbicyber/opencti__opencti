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
import AuditsWidgetMultiLines from './AuditsWidgetMultiLines';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import { AuditsWeeklyContext } from './AuditsWeeklyContext';

const auditsWeeklyGraphQuery = graphql`
  query AuditsWeeklyGraphQuery (
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

const AuditsWeeklyGraph = ({
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

  const { loginCount } = useContext(AuditsWeeklyContext);
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

    console.log(removeEntityTypeAllFromFilterGroup(dataSelection[0].filters));

    return (
      <QueryRenderer
        query={auditsWeeklyGraphQuery}
        variables={{
          operation: 'count',
          startDate: monthsAgo(12),
          endDate: now(),
          interval: 'day',
          timeSeriesParameters,
        }}
        render={({ props }) => {
          console.log(props);
          if (props && props.auditsMultiTimeSeries) {
            return (
              <AuditsWidgetMultiLines
                series={dataSelection.map((selection, i) => {
                  const intermediateSeriesData = props.auditsMultiTimeSeries[i]?.data.map((entry) => ({
                    x: new Date(entry.date).toLocaleString('en-US', { year: "numeric", month: "short", day: "numeric" }),
                    y: entry.value,
                  })) || [];
                  console.log(intermediateSeriesData);
                  console.log(props.auditsMultiTimeSeries)
                  const seriesData = intermediateSeriesData;

                  const currentDate = new Date().toLocaleString('en-US', { year: "numeric", month: "short", day: "numeric" });

                  const existingCurrentWeekData = seriesData.find((point) => point.x === currentDate);

                  if (!existingCurrentWeekData) {
                    const currentWeekLoginCount = props.auditsMultiTimeSeries[i]?.data
                      .filter((entry) => {
                        const entryDate = new Date(entry.date);
                        const today = new Date();
                        const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
                        return (entryDate <= today && entryDate > today - millisecondsPerWeek);                      
                      })
                      .reduce((sum, entry) => sum + entry.value, loginCount);

                    seriesData.push({ x: currentDate, y: currentWeekLoginCount });
                  }

                  return {
                    name: selection.label || t_i18n('Weekly activity count'),
                    data: seriesData,
                  };
                })}
                interval={'day'}
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
      title={parameters.title ?? t_i18n('Weekly Activity')}
      variant={variant}
    >
      {renderContent()}
    </WidgetContainer>
  );
};

export default AuditsWeeklyGraph;
