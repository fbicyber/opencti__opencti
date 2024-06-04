import React from 'react';
import { v4 as uuid } from 'uuid';
import { Chip, List, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RecordSourceSelectorProxy } from 'relay-runtime';
import { useFragment } from 'react-relay';
import { Clear } from '@mui/icons-material';
import { useFormatter } from '../../../../components/i18n';
import Security from '../../../../utils/Security';
import useGranted, { KNOWLEDGE_KNUPDATE } from '../../../../utils/hooks/useGranted';
import AddLocationsThreatActorIndividual from './AddLocationsThreatActorIndividual';
import FieldOrEmpty from '../../../../components/FieldOrEmpty';
import { resolveLink } from '../../../../utils/Entity';
import { APP_BASE_PATH } from '../../../../relay/environment';
import ItemIcon from '../../../../components/ItemIcon';
import { addLocationsThreatActorMutationRelationDelete } from './AddLocationsThreatActorIndividualLines';
import { ThreatActorIndividualLocationsFragment } from './ThreatActorIndividualLocation';
import { ThreatActorIndividualDetails_ThreatActorIndividual$data } from './__generated__/ThreatActorIndividualDetails_ThreatActorIndividual.graphql';
import { ThreatActorIndividualLocations_locations$key } from './__generated__/ThreatActorIndividualLocations_locations.graphql';
import useApiMutation from '../../../../utils/hooks/useApiMutation';

const ThreatActorIndividualLocationsComponent = ({ data }: {
  data: ThreatActorIndividualDetails_ThreatActorIndividual$data,
}) => {
  const { t_i18n } = useFormatter();
  const navigate = useNavigate();
  const threatActorIndividual = useFragment<ThreatActorIndividualLocations_locations$key>(
    ThreatActorIndividualLocationsFragment,
    data,
  );
  const [commitRemoveLocation] = useApiMutation(addLocationsThreatActorMutationRelationDelete);

  function removeLocation(toId: string) {
    commitRemoveLocation({
      variables: {
        fromId: threatActorIndividual.id,
        toId,
        relationship_type: 'located-at',
      },
      updater: (store: RecordSourceSelectorProxy) => {
        const node = store.get(threatActorIndividual.id);
        const locations = node?.getLinkedRecord('locations');
        if (locations) {
          const edges = locations.getLinkedRecords('edges') ?? [];
          const newEdges = edges.filter(
            (n) => n.getLinkedRecord('node')?.getValue('id') !== toId,
          );
          locations.setLinkedRecords(newEdges, 'edges');
        }
      },
    });
  }

  if (!threatActorIndividual.locations?.edges) return <></>;

  return (<>
    <Typography variant="h3" gutterBottom={true} style={{ float: 'left' }}>
      {t_i18n('Located at')}
    </Typography>
    <Security
      needs={[KNOWLEDGE_KNUPDATE]}
      placeholder={<div style={{ height: 29 }} />}
    >
      <AddLocationsThreatActorIndividual
        threatActorIndividual={threatActorIndividual}
        threatActorIndividualLocations={
          threatActorIndividual.locations.edges
        }
      />
    </Security>
    <div className="clearfix" />
    <FieldOrEmpty source={threatActorIndividual.locations}>
      <List style={{ padding: 0 }}>
        {threatActorIndividual.locations.edges.map((locationEdge) => {
          if (!locationEdge || !locationEdge.types) return <div key={uuid()} />;
          const { types } = locationEdge;
          const location = locationEdge.node;
          const link = resolveLink(location.entity_type);
          const flag = location.entity_type === 'Country'
            && (location.x_opencti_aliases ?? []).filter(
              (n) => n?.length === 2,
            )[0];

          const handleClick = () => navigate({
            pathname: `${link}/${location.id}`,
          });
          const handleDelete = types.includes('manual') && useGranted([KNOWLEDGE_KNUPDATE])
            ? () => removeLocation(locationEdge.node.id)
            : undefined;

          return (
            <Chip
              key={location.id}
              label={location.name}
              variant="outlined"
              icon={flag
                ? <img
                    style={{ width: 20 }}
                    src={`${APP_BASE_PATH}/static/flags/4x3/${flag.toLowerCase()}.svg`}
                    alt={location.name}
                  />
                : <ItemIcon type={location.entity_type} />
              }
              deleteIcon={<Clear style={{ fontSize: '16px' }} />}
              color="primary"
              style={{
                margin: '0 7px 7px 0',
                paddingLeft: '3px',
                borderRadius: 4,
                borderWidth: '1.5px',
              }}
              onClick={handleClick}
              onDelete={handleDelete}
            />
          );
        })}
      </List>
    </FieldOrEmpty>
  </>);
};

export default ThreatActorIndividualLocationsComponent;
