import React, { FunctionComponent, useState } from 'react';

// import { graphql } from 'react-relay';
// import CircularProgress from '@mui/material/CircularProgress';
//import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// import { HexagonMultipleOutline, ShieldSearch } from 'mdi-material-ui';
// import { DescriptionOutlined, DeviceHubOutlined, SettingsOutlined } from '@mui/icons-material';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import IconButton from '@mui/material/IconButton';
// import Popover from '@mui/material/Popover';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';
// import {
//   StixDomainObjectThreatKnowledgeReportsNumberQuery$data,
// } from '@components/common/stix_domain_objects/__generated__/StixDomainObjectThreatKnowledgeReportsNumberQuery.graphql';
// import {
//   StixDomainObjectThreatKnowledgeStixCoreRelationshipsNumberQuery$data,
// } from '@components/common/stix_domain_objects/__generated__/StixDomainObjectThreatKnowledgeStixCoreRelationshipsNumberQuery.graphql';
// import {
//   StixDomainObjectThreatKnowledgeQueryStixRelationshipsQuery$data,
//   StixDomainObjectThreatKnowledgeQueryStixRelationshipsQuery$variables,
// } from '@components/common/stix_domain_objects/__generated__/StixDomainObjectThreatKnowledgeQueryStixRelationshipsQuery.graphql';
// import { QueryRenderer } from '../../../../relay/environment';
// import { monthsAgo } from '../../../../utils/Time';
import { useFormatter } from '../../../../components/i18n';
import ImageCarousel, { ImagesData } from 'src/components/ImageCarousel';
import FieldOrEmpty from '../../../../components/FieldOrEmpty';
import ItemOpenVocab from '../../../../components/ItemOpenVocab';
import { List, ListItem } from '@mui/material';
// import ItemNumberDifference from '../../../../components/ItemNumberDifference';
import { resolveLink } from '../../../../utils/Entity';
// import StixCoreObjectReportsHorizontalBars from '../../analyses/reports/StixCoreObjectReportsHorizontalBars';
// import StixCoreObjectStixCoreRelationshipsCloud from '../stix_core_relationships/StixCoreObjectStixCoreRelationshipsCloud';
// import StixDomainObjectGlobalKillChain from './StixDomainObjectGlobalKillChain';
// import StixDomainObjectTimeline from './StixDomainObjectTimeline';
// import Loader, { LoaderVariant } from '../../../../components/Loader';
// import { stixDomainObjectThreatKnowledgeStixRelationshipsQuery } from './StixDomainObjectThreatKnowledgeQuery';
// import ExportButtons from '../../../../components/ExportButtons';
// import Filters from '../lists/Filters';
// import { usePaginationLocalStorage } from '../../../../utils/hooks/useLocalStorage';
// import {
//   emptyFilterGroup,
//   FilterGroup,
//   getDefaultFilterObject,
//   isFilterGroupNotEmpty,
//   useRemoveIdAndIncorrectKeysFromFilterGroupObject,
//   useFilterDefinition,
// } from '../../../../utils/filters/filtersUtils';
// import FilterIconButton from '../../../../components/FilterIconButton';


interface StixDomainObjectThreatWidgetKnowledgeProps {
  stixDomainObjectId: string;
  stixDomainObjectType: string;
  displayObservablesStats: boolean;
}

const StixDomainObjectThreatWidgetKnowledge: FunctionComponent<
StixDomainObjectThreatWidgetKnowledgeProps
> = ({ stixDomainObjectId, stixDomainObjectType, displayObservablesStats }) => {
  const { n, t_i18n } = useFormatter();
  const [viewType, setViewType] = useState('timeline');
  const [timeField, setTimeField] = useState('technical');
  const [nestedRelationships, setNestedRelationships] = useState(false);
  const [openTimeField, setOpenTimeField] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const LOCAL_STORAGE_KEY = `stix-domain-object-${stixDomainObjectId}`;
  const link = `${resolveLink(stixDomainObjectType)}/${stixDomainObjectId}/knowledge`;
  // const imagesCarousel: { images: ImagesData } = {
  //   images: {
  //     edges: (data.images?.edges ?? []).filter((n) => n?.node?.metaData?.inCarousel),
  //   } as ImagesData,
  // };
  // const hasImages = imagesCarousel.images?.edges ? imagesCarousel.images.edges.length > 0 : false;
  const hasImages = false;
  return (
    <div style={{ height: '100%' }}>
      <Typography variant="h4" gutterBottom={true}>
        {t_i18n('Basic Information')}
      </Typography>
      <Paper variant="outlined">
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={hasImages ? 7 : 6}>
            <Grid container={true} spacing={3}>
              {/* {hasImages && (
                <Grid item={true} xs={4}>
                  <ImageCarousel data={imagesCarousel} />
                </Grid>
              )} */}
              <Grid item={true} xs={hasImages ? 8 : 12}>
                <Typography variant="h3" gutterBottom={true}>
                  {t_i18n('Threat actor types')}
                </Typography>
                <Typography
                  variant="h3"
                  gutterBottom={true}
                  style={{ marginTop: 20 }}
                >
                  {t_i18n('Description')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item={true} xs={hasImages ? 5 : 6}>
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('First seen')}
            </Typography>
            {t_i18n('Placeholder')}
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Last seen')}
            </Typography>
            {t_i18n('Placeholder')}
          </Grid>
        </Grid>
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={4}>
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Sophistication')}
            </Typography>
          </Grid>
          <Grid item={true} xs={4}>
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Resource level')}
            </Typography>
            <ItemOpenVocab
              type="attack-resource-level-ov"
              value={'Placeholder'}
              small
            />
          </Grid>
          <Grid item={true} xs={4}>
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Primary motivation')}
            </Typography>
            <ItemOpenVocab
              type="attack-motivation-ov"
              value={'Placeholder'}
              small
            />
          </Grid>
          <Grid item={true} xs={4}>
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Roles')}
            </Typography>
            <FieldOrEmpty source={[]}>
              {[] && (
                <List>
                  {/* {data.roles.map((role) => (
                    <ListItem key={role} dense={true} divider={true}>
                      <ListItemIcon>
                        <DramaMasks />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <ItemOpenVocab
                            type="threat-actor-individual-role-ov"
                            value={role}
                            small
                          />
                        }
                      />
                    </ListItem>
                  ))} */}
                </List>
              )}
            </FieldOrEmpty>
          </Grid>
          <Grid item={true} xs={4}>
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Goals')}
            </Typography>
            <FieldOrEmpty source={[]}>
              {[] && (
                <List>
                  {/* {data.goals.map((goal) => (
                    <ListItem key={goal} dense={true} divider={true}>
                      <ListItemIcon>
                        <BullseyeArrow />
                      </ListItemIcon>
                      <ListItemText
                        primary={<pre className={classes.smallPre}>{goal}</pre>}
                      />
                    </ListItem>
                  ))} */}
                </List>
              )}
            </FieldOrEmpty>
          </Grid>
          <Grid item={true} xs={4}>
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Secondary motivations')}
            </Typography>
            <FieldOrEmpty source={[]}>
              {[] && (
                <List>
                  {/* {data.secondary_motivations.map((secondaryMotivation) => (
                    <ListItem
                      key={secondaryMotivation}
                      dense={true}
                      divider={true}
                    >
                      <ListItemIcon>
                        <ArmFlexOutline />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <ItemOpenVocab
                            type="attack-motivation-ov"
                            value={secondaryMotivation}
                            small
                          />
                        }
                      />
                    </ListItem>
                  ))} */}
                </List>
              )}
            </FieldOrEmpty>
          </Grid>
          <Grid item={true} xs={4}>
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Personal motivations')}
            </Typography>
            <FieldOrEmpty source={[]}>
              {[] && (
                <List>
                  {/* {data.personal_motivations.map((personalMotivation) => (
                    <ListItem
                      key={personalMotivation}
                      dense={true}
                      divider={true}
                    >
                      <ListItemIcon>
                        <ArmFlexOutline />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <ItemOpenVocab
                            type="attack-motivation-ov"
                            value={personalMotivation}
                            small
                          />
                        }
                      />
                    </ListItem>
                  ))} */}
                </List>
              )}
            </FieldOrEmpty>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default StixDomainObjectThreatWidgetKnowledge;
