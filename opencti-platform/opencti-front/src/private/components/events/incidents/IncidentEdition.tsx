import React from 'react';
import EditEntityControlledDial from 'src/components/EditEntityButton';
import IncidentEditionContainer, { IncidentEditionQuery } from './IncidentEditionContainer';
import { incidentEditionOverviewFocus } from './IncidentEditionOverview';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';
import { IncidentEditionContainerQuery } from './__generated__/IncidentEditionContainerQuery.graphql';
import useApiMutation from '../../../../utils/hooks/useApiMutation';

const IncidentEdition = ({ incidentId }: { incidentId: string }) => {
  const [commit] = useApiMutation(incidentEditionOverviewFocus);
  const handleClose = () => {
    commit({
      variables: {
        id: incidentId,
        input: { focusOn: '' },
      },
    });
  };

  const queryRef = useQueryLoading<IncidentEditionContainerQuery>(
    IncidentEditionQuery,
    { id: incidentId },
  );
  return (
    <>
      {queryRef && (
        <React.Suspense
          fallback={<Loader variant={LoaderVariant.inElement} />}
        >
          <IncidentEditionContainer
            queryRef={queryRef}
            handleClose={handleClose}
            controlledDial={EditEntityControlledDial}
          />
        </React.Suspense>
      )}
    </>
  );
};

export default IncidentEdition;
