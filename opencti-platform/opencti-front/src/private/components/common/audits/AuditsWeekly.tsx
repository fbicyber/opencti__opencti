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
  const { t_i18n } = useFormatter();
  const isGrantedToSettings = useGranted([SETTINGS_SETACCESSES, SETTINGS_SECURITYACTIVITY, VIRTUAL_ORGANIZATION_ADMIN]);
  const isEnterpriseEdition = useEnterpriseEdition();

  const renderContent = () => {
    if (!isGrantedToSettings || !isEnterpriseEdition) {
      return <WidgetAccessDenied />;
    }

    const selection = dataSelection[0];
    const dateAttribute = 'timestamp';
    const { filters } = buildFiltersAndOptionsForWidgets(selection.filters, { removeTypeAll: true, dateAttribute });

    const { startDate, endDate } = getWeekStartEnd();
    const { startDate: previousStartDate, endDate: previousEndDate } = getWeekStartEnd(-1);

    return (
      <QueryRenderer
        query={auditsWeeklyLoginDistributionQuery}
        variables={{ startDate, endDate, dateAttribute, filters }}
        render={({ props: week0Props }: { props?: QueryProps }) => (
          <QueryRenderer
            query={auditsWeeklyLoginDistributionQuery}
            variables={{ startDate: previousStartDate, endDate: previousEndDate, dateAttribute, filters }}
            render={({ props: week1Props }: { props?: QueryProps }) => {
              if (week0Props && week1Props) {
                const week0Users = new Set(week0Props.loginResults?.map((user) => user.label));
                const week1Users = new Set(week1Props.loginResults?.map((user) => user.label));
                const currentCount = week0Users.size;
                const previousCount = week1Users.size;
                const difference = currentCount - previousCount;

                return <WidgetDifference count={currentCount} change={difference} interval={"week"} />;
              }
              if (week0Props || week1Props) {
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
