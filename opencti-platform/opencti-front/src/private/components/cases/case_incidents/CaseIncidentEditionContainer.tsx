import React, { FunctionComponent } from 'react';
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay';
import Drawer, { DrawerVariant } from '@components/common/drawer/Drawer';
import { CaseIncidentEditionOverview_case$key } from '@components/cases/case_incidents/__generated__/CaseIncidentEditionOverview_case.graphql';
import useHelper from 'src/utils/hooks/useHelper';
import ErrorNotFound from '../../../../components/ErrorNotFound';
import { useFormatter } from '../../../../components/i18n';
import { useIsEnforceReference } from '../../../../utils/hooks/useEntitySettings';
import { CaseIncidentEditionContainerCaseQuery } from './__generated__/CaseIncidentEditionContainerCaseQuery.graphql';
import CaseIncidentEditionOverview from './CaseIncidentEditionOverview';

interface CaseIncidentEditionContainerProps {
  queryRef: PreloadedQuery<CaseIncidentEditionContainerCaseQuery>
  handleClose: () => void
  open?: boolean
  controlledDial?: ({ onOpen }: { onOpen: () => void }) => JSX.Element
}

export const caseIncidentEditionQuery = graphql`
  query CaseIncidentEditionContainerCaseQuery($id: String!) {
    caseIncident(id: $id) {
      ...CaseIncidentEditionOverview_case
      editContext {
        name
        focusOn
      }
    }
  }
`;

const CaseIncidentEditionContainer: FunctionComponent<
CaseIncidentEditionContainerProps
> = ({ queryRef, handleClose, open, controlledDial }) => {
  const { t_i18n } = useFormatter();
  const { isFeatureEnable } = useHelper();
  const FABReplaced = isFeatureEnable('FAB_REPLACEMENT');
  const { caseIncident } = usePreloadedQuery(caseIncidentEditionQuery, queryRef);
  if (caseIncident === null) {
    return <ErrorNotFound />;
  }
  return (
    <Drawer
      title={t_i18n('Update an incident response')}
      variant={!FABReplaced && open == null ? DrawerVariant.update : undefined}
      context={caseIncident?.editContext}
      onClose={handleClose}
      open={open}
      controlledDial={FABReplaced ? controlledDial : undefined}
    >
      {({ onClose }) => (
        <CaseIncidentEditionOverview
          caseRef={caseIncident as CaseIncidentEditionOverview_case$key}
          context={caseIncident?.editContext}
          enableReferences={useIsEnforceReference('Case-Incident')}
          handleClose={onClose}
        />
      )}
    </Drawer>
  );
};

export default CaseIncidentEditionContainer;
