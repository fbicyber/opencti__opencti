import React from 'react'; 
import { graphql } from 'react-relay';
import { QueryRenderer } from '../../../../relay/environment';
import { useFormatter } from '../../../../components/i18n';
import { daysAgo, now } from '../../../../utils/Time';
import useGranted, { SETTINGS_SECURITYACTIVITY, SETTINGS_SETACCESSES, VIRTUAL_ORGANIZATION_ADMIN } from '../../../../utils/hooks/useGranted';
import useEnterpriseEdition from '../../../../utils/hooks/useEnterpriseEdition';
import { removeEntityTypeAllFromFilterGroup } from '../../../../utils/filters/filtersUtils';
import WidgetContainer from '../../../../components/dashboard/WidgetContainer';
import WidgetNoData from '../../../../components/dashboard/WidgetNoData';
import AuditsWidgetMultiLines from './AuditsWidgetMultiLines';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import { getWeekStartEnd } from '../../../../utils/Time';

const auditsWeeklyGraphQuery = graphql`
  query AuditsWeeklyGraphQuery (
      $dateAttribute: String
      $distributionParameters: [AuditsDistributionParameters]
    ) {
    userLoginResults: auditsMultiDistribution(
  			dateAttribute: $dateAttribute
        operation: count
        types: ["History", "Activity"]
        distributionParameters: $distributionParameters 
    ) {
      data {
        label
        value
      }
    }
  }
`;

const AuditsWeeklyGraph = ({
  variant,
  height,
  parameters = {},
  withExportPopover = false,
  isReadOnly = false,
}) => {
  const { t_i18n } = useFormatter();
  const isGrantedToSettings = useGranted([SETTINGS_SETACCESSES, SETTINGS_SECURITYACTIVITY, VIRTUAL_ORGANIZATION_ADMIN]);
  const isEnterpriseEdition = useEnterpriseEdition();

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

    const weeks = new Array(6);
    for (let i = 0; i < 6; i++){
      const { startDate, endDate } = getWeekStartEnd(-i);
      weeks[i] = ({startDate, endDate});
    }
    weeks[0].endDate = new Date().toISOString();

    const filters = {
      mode: "and",
      filters: [
          {
              key: "event_scope",
              values: [
                  "login"
              ]
          }
      ],
      filterGroups: []
    }

    const auditsDistributionParameters = weeks.map(({startDate, endDate}) => ({
      field: 'timestamp',
      startDate,
      endDate,
      types: ['History', 'Activity'],
      filters: removeEntityTypeAllFromFilterGroup(filters),
    }));

    console.log(auditsDistributionParameters);

    return (
      <QueryRenderer
        query={auditsWeeklyGraphQuery}
        variables={{
          dateAttribute: "timestamp",
          auditsDistributionParameters,
        }}
        render={({ props }) => {
          if (props) {
            return (
              <AuditsWidgetMultiLines
                series={weeks.map(({ startDate },  i) => {
                  const intermediateSeriesData = props.userLoginResults.data.map((entry) => {
                    console.log(entry);
                    return {
                    x: new Date(startDate).toLocaleString('en-US', { year: "numeric", month: "short", day: "numeric" }),
                    y: entry.length,
                  }}) || [];
                  const seriesData = intermediateSeriesData;

                  const currentDate = new Date().toLocaleString('en-US', { year: "numeric", month: "short", day: "numeric" });

                  const existingCurrentWeekData = seriesData.find((point) => point.x === currentDate);

                  let loginCount;
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
                interval={'week'}
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
