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
import { AuditsWeeklyContext } from './AuditsWeeklyContext';

interface LoginResult {
  label: string;
  value: number;
}

interface QueryProps {
  loginResults?: LoginResult[];
}

const getWeekStartEnd = (offset = 0) => {
  const now = new Date();
  now.setDate(now.getDate() + (offset * 7));
  const startDateDate = new Date(now.getFullYear(), now.getMonth(), (now.getDate() - now.getDay()) + 1); // get the Monday
  const endDateDate = new Date(startDateDate);
  endDateDate.setDate(endDateDate.getDate() + 6);
  endDateDate.setHours(23);
  endDateDate.setMinutes(59);
  endDateDate.setSeconds(59);
  const startDate =  startDateDate.toISOString();
  const endDate = endDateDate.toISOString();
  return {startDate, endDate};
}

// const getMonthStartEnd = (offset = 0) => {
//   const now = new Date();
//   now.setMonth(now.getMonth() + offset);
//   now.setDate(1);
//   const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
//   const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
//   return { startDate, endDate };
// };

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
        limit: 30
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
  const { loginCount, setLoginCount } = useContext(AuditsWeeklyContext);
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

    const { startDate, endDate } = getWeekStartEnd();
    const { startDate: previousStartDate, endDate: previousEndDate } = getWeekStartEnd(-1);

    return (
      <QueryRenderer
        query={auditsWeeklyLoginDistributionQuery}
        variables={{ startDate, endDate, dateAttribute, filters }}
        render={({ props: currentProps }: { props?: QueryProps }) => (
          <QueryRenderer
            query={auditsWeeklyLoginDistributionQuery}
            variables={{ startDate: previousStartDate, endDate: previousEndDate, dateAttribute, filters }}
            render={({ props: previousProps }: { props?: QueryProps }) => {
              if (currentProps && previousProps) {
                const currentUsers = new Set(currentProps.loginResults?.map((user) => user.label));
                const previousUsers = new Set(previousProps.loginResults?.map((user) => user.label));

                console.log('currentUsers is: ', currentUsers);
                console.log('previousUsers is: ', previousUsers);

                const currentCount = currentUsers.size;
                const previousCount = previousUsers.size;

                const difference = currentCount - previousCount;

                setLoginCount(currentCount);
                console.log('currentCount is: ', currentCount);
                console.log('LoginCount - AuditsWeekly is: ', loginCount);
                console.log('previousCount is: ', previousCount);
                console.log('difference is: ', difference);

                return <WidgetDifference count={loginCount} change={difference} interval={"week"} />;
              }
              if (currentProps || previousProps) {
                return <WidgetNoData />;
              }
              return <Loader variant={LoaderVariant.inElement} />;
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
