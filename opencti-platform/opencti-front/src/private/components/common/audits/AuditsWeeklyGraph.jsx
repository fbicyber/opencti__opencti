import React from 'react';
import { graphql } from 'react-relay';
import { QueryRenderer } from '../../../../relay/environment';
import { useFormatter } from '../../../../components/i18n';
import useGranted, { SETTINGS_SECURITYACTIVITY, SETTINGS_SETACCESSES, VIRTUAL_ORGANIZATION_ADMIN } from '../../../../utils/hooks/useGranted';
import useEnterpriseEdition from '../../../../utils/hooks/useEnterpriseEdition';
import WidgetContainer from '../../../../components/dashboard/WidgetContainer';
import WidgetNoData from '../../../../components/dashboard/WidgetNoData';
import AuditsWidgetMultiLines from './AuditsWidgetMultiLines';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import { getWeekStartEnd } from '../../../../utils/Time';

const getWeekRangesVariables = (weekStartDay = 'Monday') => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  let diffToWeekStart;

  if (weekStartDay.toLowerCase() === 'sunday') {
    diffToWeekStart = dayOfWeek;
  } else {
    diffToWeekStart = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  }

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - diffToWeekStart);

  const variables = {};

  for (let i = 0; i <= 5; i++) {
    const weekStart = new Date(startOfWeek);
    weekStart.setDate(startOfWeek.getDate() - (i * 7));

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    variables[`startDate${i}`] = weekStart;
    variables[`endDate${i}`] = weekEnd;
  }

  return variables;
};

const auditsWeeklyGraphQuery = graphql`
  query AuditsWeeklyGraphQuery (
      $dateAttribute: String
      $filters: FilterGroup
      $startDate0: DateTime!
      $endDate0: DateTime!
      $startDate1: DateTime!
      $endDate1: DateTime!
      $startDate2: DateTime!
      $endDate2: DateTime!
      $startDate3: DateTime!
      $endDate3: DateTime!
      $startDate4: DateTime!
      $endDate4: DateTime!
      $startDate5: DateTime!
      $endDate5: DateTime!
    ) {
    userLoginResults: auditsMultiDistribution(
  			dateAttribute: $dateAttribute
        operation: count
        types: ["History", "Activity"]
        distributionParameters:[
        {
          field: "user_id",
          startDate: $startDate0
          endDate: $endDate0
          filters: $filters
        },
        {
          field: "user_id",
          startDate: $startDate1
          endDate: $endDate1
          filters: $filters
        },
        {
          field: "user_id",
          startDate: $startDate2
          endDate: $endDate2
          filters: $filters
        },
        {
          field: "user_id",
          startDate: $startDate3
          endDate: $endDate3
          filters: $filters
        },
        {
          field: "user_id",
          startDate: $startDate4
          endDate: $endDate4
          filters: $filters
        },
        {
          field: "user_id",
          startDate: $startDate5
          endDate: $endDate5
          filters: $filters
        }
      ]
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
    return (
      <QueryRenderer
        query={auditsWeeklyGraphQuery}
        variables={{
          ...getWeekRangesVariables('Monday'),
        }}
        render={({ props }) => {
          if (props && props.userLoginResults) {
            return (
              <AuditsWidgetMultiLines
                series={[{
                  name: t_i18n('Weekly activity count'),
                  data: props.userLoginResults.map((selection, i) => {
                    const { startDate, _ } = getWeekStartEnd(-i);
                    return {
                      x: new Date(startDate).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                      y: selection.data.length,
                    };
                  }),
                }]}
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
