import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, createFragmentContainer } from 'react-relay';
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid';
import ThreatActorGroupDetails from './ThreatActorGroupDetails';
import ThreatActorGroupEdition from './ThreatActorGroupEdition';
import Security from '../../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../../utils/hooks/useGranted';
import StixCoreObjectOrStixCoreRelationshipNotes from '../../analyses/notes/StixCoreObjectOrStixCoreRelationshipNotes';
import StixDomainObjectOverview from '../../common/stix_domain_objects/StixDomainObjectOverview';
import StixCoreObjectExternalReferences from '../../analyses/external_references/StixCoreObjectExternalReferences';
import StixCoreObjectLatestHistory from '../../common/stix_core_objects/StixCoreObjectLatestHistory';
import SimpleStixObjectOrStixRelationshipStixCoreRelationships from '../../common/stix_core_relationships/SimpleStixObjectOrStixRelationshipStixCoreRelationships';
import StixCoreObjectOrStixRelationshipLastContainers from '../../common/containers/StixCoreObjectOrStixRelationshipLastContainers';

const styles = () => ({
  container: {
    margin: 0,
  },
  gridContainer: {
    marginBottom: 20,
  },
});

class ThreatActorGroupComponent extends Component {
  render() {
    const { classes, threatActorGroup } = this.props;
    return (
      <>
        <Grid
          container={true}
          spacing={3}
          classes={{ container: classes.gridContainer }}
        >
          <Grid item xs={6}>
            <ThreatActorGroupDetails threatActorGroup={threatActorGroup} />
          </Grid>
          <Grid item xs={6}>
            <StixDomainObjectOverview stixDomainObject={threatActorGroup} />
          </Grid>
          <Grid item xs={6}>
            <SimpleStixObjectOrStixRelationshipStixCoreRelationships
              stixObjectOrStixRelationshipId={threatActorGroup.id}
              stixObjectOrStixRelationshipLink={`/dashboard/threats/threat_actors_group/${threatActorGroup.id}/knowledge`}
            />
          </Grid>
          <Grid item xs={6}>
            <StixCoreObjectOrStixRelationshipLastContainers
              stixCoreObjectOrStixRelationshipId={threatActorGroup.id}
            />
          </Grid>
          <Grid item xs={6}>
            <StixCoreObjectExternalReferences
              stixCoreObjectId={threatActorGroup.id}
            />
          </Grid>
          <Grid item xs={6}>
            <StixCoreObjectLatestHistory
              stixCoreObjectId={threatActorGroup.id}
            />
          </Grid>
        </Grid>
        <StixCoreObjectOrStixCoreRelationshipNotes
          stixCoreObjectOrStixCoreRelationshipId={threatActorGroup.id}
          defaultMarkings={threatActorGroup.objectMarking ?? []}
        />
        <Security needs={[KNOWLEDGE_KNUPDATE]}>
          <ThreatActorGroupEdition threatActorGroupId={threatActorGroup.id} />
        </Security>
      </>
    );
  }
}

ThreatActorGroupComponent.propTypes = {
  threatActorGroup: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
};

const ThreatActorGroup = createFragmentContainer(ThreatActorGroupComponent, {
  threatActorGroup: graphql`
    fragment ThreatActorGroup_ThreatActorGroup on ThreatActorGroup {
      id
      standard_id
      entity_type
      x_opencti_stix_ids
      spec_version
      revoked
      confidence
      created
      modified
      created_at
      updated_at
      createdBy {
        ... on Identity {
          id
          name
          entity_type
          x_opencti_reliability
        }
      }
      creators {
        id
        name
      }
      objectMarking {
        id
        definition
        definition_type
        definition
        x_opencti_order
        x_opencti_color
      }
      objectLabel {
        id
        value
        color
      }
      name
      aliases
      status {
        id
        order
        template {
          name
          color
        }
      }
      workflowEnabled
      ...ThreatActorGroupDetails_ThreatActorGroup
    }
  `,
});

export default withStyles(styles)(ThreatActorGroup);
