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

const getMonthRangesVariables = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const referenceDate = new Date(today);
  referenceDate.setDate(1);

  const variables = {};

  for (let i = 0; i <= 5; i++) {
    const monthStart = new Date(referenceDate);
    monthStart.setMonth(referenceDate.getMonth() - i);
    monthStart.setDate(1);
    monthStart.setHours(0,0,0,0);

    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthStart.getMonth()+1);
    monthEnd.setDate(monthEnd.getDate()-1);
    monthEnd.setHours(23, 59, 59, 999);

    variables[`startDate${i}`] = monthStart;
    variables[`endDate${i}`] = monthEnd;
  }

  console.log('variables: ', variables);

  return variables;
};

const auditsMonthlyGraphQuery = graphql`
  query AuditsMonthlyGraphQuery (
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

console.log("auditsMonthlyGraphQuery: ", auditsMonthlyGraphQuery);

// const getMonthStartEnd = (offset) => {
//   const today = new Date();
//   let targetMonth = new Date(today.getFullYear(), today.getMonth() + offset, 1);
//   let startDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
//   let endDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0, 23, 59, 59);

//   return {
//     startDate: startDate.toISOString(),
//     endDate: endDate.toISOString(),
//   };
// };

const getMonthStartEnd = (offset = 0) => {
  const now = new Date();
  now.setMonth(now.getMonth() + offset);
  now.setDate(1);
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
  return { startDate, endDate };
};

const AuditsMonthlyGraph = ({
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
        query={auditsMonthlyGraphQuery}
        variables={{
          ...getMonthRangesVariables(),
        }}
        render={({ props }) => {
          console.log("props: ", props);

          if (props && props.userLoginResults) {
            console.log("props.userLoginResults: ", props.userLoginResults);

            return (
              <AuditsWidgetMultiLines
                series={[{
                  name: t_i18n('Monthly activity count'),
                  data: props.userLoginResults.map((selection, i) => {
                    const { startDate, _ } = getMonthStartEnd(-i);
                    return {
                      x: new Date(startDate).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                      y: selection.data.length,
                    };
                  }),
                }]}
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
