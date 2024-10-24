import React, { FunctionComponent } from 'react';
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay';
import Drawer, { DrawerControlledDialType, DrawerVariant } from '@components/common/drawer/Drawer';
import { useFormatter } from '../../../../components/i18n';
import InfrastructureEditionOverview from './InfrastructureEditionOverview';
import { useIsEnforceReference } from '../../../../utils/hooks/useEntitySettings';
import { InfrastructureEditionContainerQuery } from './__generated__/InfrastructureEditionContainerQuery.graphql';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import useHelper from '../../../../utils/hooks/useHelper';
import InfrastructureDeletion from './InfrastructureDeletion';
import { useParams } from 'react-router-dom';

export const infrastructureEditionContainerQuery = graphql`
  query InfrastructureEditionContainerQuery($id: String!) {
    infrastructure(id: $id) {
      ...InfrastructureEditionOverview_infrastructure
      editContext {
        name
        focusOn
      }
    }
  }
`;

interface InfrastructureEditionContainerProps {
  handleClose: () => void
  queryRef: PreloadedQuery<InfrastructureEditionContainerQuery>
  open?: boolean
  controlledDial?: DrawerControlledDialType
}

const InfrastructureEditionContainer: FunctionComponent<InfrastructureEditionContainerProps> = ({
  handleClose,
  queryRef,
  open,
  controlledDial,
}) => {
  const { t_i18n } = useFormatter();
  const { isFeatureEnable } = useHelper();
  const isFABReplaced = isFeatureEnable('FAB_REPLACEMENT');
  const { infrastructureId } = useParams() as { infrastructureId: string };
  const { infrastructure } = usePreloadedQuery(infrastructureEditionContainerQuery, queryRef);

  if (infrastructure) {
    return (
      <Drawer
        title={t_i18n('Update an infrastructure')}
        variant={!isFABReplaced && open == null ? DrawerVariant.update : undefined}
        context={infrastructure.editContext}
        onClose={handleClose}
        open={open}
        controlledDial={isFABReplaced ? controlledDial : undefined}
      >
        {({ onClose }) => (
          <>
            <InfrastructureEditionOverview
              infrastructureData={infrastructure}
              enableReferences={useIsEnforceReference('Infrastructure')}
              context={infrastructure.editContext}
              handleClose={onClose}
            />
            {isFABReplaced && (
              <InfrastructureDeletion
                id={infrastructureId}
              />
            )}
          </>
        )}
      </Drawer>
    );
  }

  return <Loader variant={LoaderVariant.inElement} />;
};

export default InfrastructureEditionContainer;
