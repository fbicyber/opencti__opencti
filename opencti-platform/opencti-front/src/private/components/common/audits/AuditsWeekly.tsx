import React, { useContext } from 'react';
import { graphql } from 'react-relay';
import { QueryRenderer } from '../../../../relay/environment';
import { useFormatter } from '../../../../components/i18n';
import useGranted, { SETTINGS_SECURITYACTIVITY, SETTINGS_SETACCESSES, VIRTUAL_ORGANIZATION_ADMIN } from '../../../../utils/hooks/useGranted';
import useEnterpriseEdition from '../../../../utils/hooks/useEnterpriseEdition';
import { buildFiltersAndOptionsForWidgets } from '../../../../utils/filters/filtersUtils';
import WidgetContainer from '../../../../components/dashboard/WidgetContainer';
import WidgetNoData from '../../../../components/dashboard/WidgetNoData';
import WidgetAccessDenied from '../../../../components/dashboard/WidgetAccessDenied';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import WidgetDifference from '../../../../components/dashboard/WidgetDifference';
import { getWeekStartEnd } from '../../../../utils/Time';

interface LoginResult {
  label: string;
  value: number;
}

interface QueryProps {
  loginResults?: LoginResult[];
}

const auditsWeeklyLoginDistributionQuery = graphql`
  query AuditsWeeklyLoginDistributionQuery (
    $startDate: DateTime
    $endDate: DateTime
    $dateAttribute: String
    $filters: FilterGroup
  ) {
    loginResults: auditsDistribution(
        field: "user_id"
        startDate: $startDate
        endDate: $endDate
        dateAttribute: $dateAttribute
        operation: count
        types: ["History", "Activity"]
        filters: $filters
    ) {
        label
        value
    }
  }
`;

interface AuditsWeeklyProps {
  variant: string;
  height: number;
  dataSelection: any[];
  parameters?: { title?: string };
}

const AuditsWeekly: React.FC<AuditsWeeklyProps> = ({
  variant,
  height,
  dataSelection,
  parameters = {},
}) => {
  // const { loginCount, setLoginCount, setWeeklyActiveUsersHistory } = useContext(AuditsWeeklyContext);
  const { t_i18n } = useFormatter();
  const isGrantedToSettings = useGranted([SETTINGS_SETACCESSES, SETTINGS_SECURITYACTIVITY, VIRTUAL_ORGANIZATION_ADMIN]);
  const isEnterpriseEdition = useEnterpriseEdition();

  const renderContent = () => {
    if (!isGrantedToSettings || !isEnterpriseEdition) {
      return <WidgetAccessDenied />;
    }

    const selection = dataSelection[0];
    const dateAttribute = selection.date_attribute && selection.date_attribute.length > 0
      ? selection.date_attribute
      : 'timestamp';
    const { filters } = buildFiltersAndOptionsForWidgets(selection.filters, { removeTypeAll: true, dateAttribute });

    const weeks = new Array(6);
    for (let i = 0; i < 6; i++){
      const { startDate, endDate } = getWeekStartEnd(-i);
      weeks[i] = ({startDate, endDate});
    }

    return (
      <QueryRenderer
        query={auditsWeeklyLoginDistributionQuery}
        variables={{ startDate: weeks[0].startDate, endDate: weeks[0].endDate, dateAttribute, filters }}
        render={({ props: week0Props }: { props?: QueryProps }) => (
          <QueryRenderer
            query={auditsWeeklyLoginDistributionQuery}
            variables={{ startDate: weeks[1].startDate, endDate: weeks[1].endDate, dateAttribute, filters }}
            render={({ props: week1Props }: { props?: QueryProps }) => {
              // <QueryRenderer
              //   query={auditsWeeklyLoginDistributionQuery}
              //   variables={{ startDate: weeks[2].startDate, endDate: weeks[2].endDate, dateAttribute, filters }}
              //   render={({ props: week2Props }: { props?: QueryProps }) => (
              //     <QueryRenderer
              //       query={auditsWeeklyLoginDistributionQuery}
              //       variables={{ startDate: weeks[3].startDate, endDate: weeks[3].endDate, dateAttribute, filters }}
              //       render={({ props: week3Props }: { props?: QueryProps }) => (
              //         <QueryRenderer
              //           query={auditsWeeklyLoginDistributionQuery}
              //           variables={{ startDate: weeks[4].startDate, endDate: weeks[4].endDate, dateAttribute, filters }}
              //           render={({ props: week4Props }: { props?: QueryProps }) => (
              //             <QueryRenderer
              //               query={auditsWeeklyLoginDistributionQuery}
              //               variables={{ startDate: weeks[5].startDate, endDate: weeks[5].endDate, dateAttribute, filters }}
              //               render={({ props: week5Props }: { props?: QueryProps }) => (
                              if (week0Props && week1Props) {
                                const week0Users = new Set(week0Props.loginResults?.map((user) => user.label));
                                const week1Users = new Set(week1Props.loginResults?.map((user) => user.label));
                                
                                // const week2Users = new Set(week2Props.loginResults?.map((user) => user.label));
                                // const week3Users = new Set(week3Props.loginResults?.map((user) => user.label));
                                // const week4Users = new Set(week4Props.loginResults?.map((user) => user.label));
                                // const week5Users = new Set(week5Props.loginResults?.map((user) => user.label));

                                const weeklyActiveUsersHistory = new Array(6);
                                const currentCount = weeklyActiveUsersHistory[0] = week0Users.size;
                                const previousCount = weeklyActiveUsersHistory[1] = week1Users.size;
                                // weeklyActiveUsersHistory[2] = week2Users.size;
                                // weeklyActiveUsersHistory[3] = week3Users.size;
                                // weeklyActiveUsersHistory[4] = week4Users.size;
                                // weeklyActiveUsersHistory[5] = week5Users.size;

                                // setWeeklyActiveUsersHistory(weeklyActiveUsersHistory);
                
                                const difference = currentCount - previousCount;
                
                                // setLoginCount(currentCount);
                
                                return <WidgetDifference count={currentCount} change={difference} interval={"week"} />;
                              }
                              if (week0Props || week1Props) {
                                return <WidgetNoData />;
                              }
                              return <Loader variant={LoaderVariant.inElement} />;
              //             )}
              //            />
              //          )}
              //         />
              //       )}
              //     />
              //   )}
              // />
            }}
          />
        )}
      />
    );
  };

  return (
    <WidgetContainer
      height={height}
      title={parameters.title ?? t_i18n('Entities number')}
      variant={variant}
    >
      {renderContent()}
    </WidgetContainer>
  );
};

export default AuditsWeekly;
