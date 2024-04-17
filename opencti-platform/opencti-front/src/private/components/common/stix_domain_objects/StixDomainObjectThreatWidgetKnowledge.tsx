import React, { FunctionComponent, useState } from 'react';
import type { Theme } from '../../../../components/Theme';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useFormatter } from '../../../../components/i18n';
import ImageCarousel, { ImagesData } from 'src/components/ImageCarousel';
import FieldOrEmpty from '../../../../components/FieldOrEmpty';
import ItemOpenVocab from '../../../../components/ItemOpenVocab';
import { CardContent, List, ListItem } from '@mui/material';
import { resolveLink } from '../../../../utils/Entity';
import ItemNumberDifference from 'src/components/ItemNumberDifference';


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

  const hasImages = false;
  return (
    <Grid container spacing={3} xs={12}>
      <Grid item xs={4}>
        <Grid container xs={12} >
          <Paper variant="outlined" style={{
            height: '100%',
            minHeight: '100%',
            width: '100%',
            minWidth: '100%',
            padding: '15px',
            borderRadius: 4,
          }}>
            <Typography variant="h4" gutterBottom={true}>
              {t_i18n('Basic Information')}
            </Typography>
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('True Name')}
            </Typography>
            {t_i18n('Placeholder')}
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Alias/Monikers')}
            </Typography>
            {t_i18n('Placeholder')}
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Biometrics')}
            </Typography>
            {t_i18n('Placeholder')}
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Languages')}
            </Typography>
            {t_i18n('Placeholder')}
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Sources')}
            </Typography>
            <FieldOrEmpty source={[]}>
              {[] && (
                <List>
                </List>
              )}
            </FieldOrEmpty>
          </Paper>
        </Grid>
        <Grid container xs={12} style={{ marginTop: 30 }}>
          <Card
            variant="outlined"
            style={{
              height: 120,
              width: '100%',
              minWidth: '100%',
            }}
          >
            <CardContent>
              <div style={{
                marginTop: 5,
                textTransform: 'uppercase',
                fontSize: 12,
                fontWeight: 500,
                color: '#a8a8a8',
              }}>{t_i18n('Participates In')}</div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={8}>
        <Grid container spacing={3} xs={12}>
          <Grid item xs={6}>
            <Card
              variant="outlined"
              style={{ height: 120 }}
            >
              <CardContent>
                <div style={{
                  marginTop: 5,
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#a8a8a8',
                }}>{t_i18n('Associations')}</div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card
              variant="outlined"
              style={{ height: 120 }}
            >
              <CardContent>
                <div style={{
                  marginTop: 5,
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#a8a8a8',
                }}>{t_i18n('Locations')}</div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} style={{ marginTop: 30 }}>
            <Card
              variant="outlined"
              style={{ height: 120 }}
            >
              <CardContent>
                <div style={{
                  marginTop: 5,
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#a8a8a8',
                }}>{t_i18n('Targets')}</div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3} style={{ marginTop: 30 }}>
          <Card
              variant="outlined"
              style={{ height: 120 }}
            >
              <CardContent>
                <div style={{
                  marginTop: 5,
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#a8a8a8',
                }}>{t_i18n('Malware')}</div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3} style={{ marginTop: 30 }}>
          <Card
              variant="outlined"
              style={{ height: 120 }}
            >
              <CardContent>
                <div style={{
                  marginTop: 5,
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#a8a8a8',
                }}>{t_i18n('Channels')}</div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3} style={{ marginTop: 30 }}>
          <Card
              variant="outlined"
              style={{ height: 120 }}
            >
              <CardContent>
                <div style={{
                  marginTop: 5,
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#a8a8a8',
                }}>{t_i18n('Tools')}</div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3} style={{ marginTop: 30 }}>
          <Card
              variant="outlined"
              style={{ height: 120 }}
            >
              <CardContent>
                <div style={{
                  marginTop: 5,
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#a8a8a8',
                }}>{t_i18n('Attack Patterns')}</div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} style={{ marginTop: 30 }}>
          <Card
              variant="outlined"
              style={{ height: 120 }}
            >
              <CardContent>
                <div style={{
                  marginTop: 5,
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#a8a8a8',
                }}>{t_i18n('Intrusion Sets')}</div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} style={{ marginTop: 30 }}>
          <Card
              variant="outlined"
              style={{ height: 120 }}
            >
              <CardContent>
                <div style={{
                  marginTop: 5,
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#a8a8a8',
                }}>{t_i18n('Indicators')}</div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StixDomainObjectThreatWidgetKnowledge;
