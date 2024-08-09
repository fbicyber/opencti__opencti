import React, { FunctionComponent } from 'react';
import { graphql, useFragment } from 'react-relay';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { MoreVert } from '@mui/icons-material';
import { RssBox } from 'mdi-material-ui';
import Slide, { SlideProps } from '@mui/material/Slide';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';
import IngestionRssPopover from './IngestionRssPopover';
import { useFormatter } from '../../../../components/i18n';
import ItemBoolean from '../../../../components/ItemBoolean';
import Security from '../../../../utils/Security';
import { INGESTION_SETINGESTIONS } from '../../../../utils/hooks/useGranted';
import { IngestionRssLine_node$key } from './__generated__/IngestionRssLine_node.graphql';
import { DataColumns } from '../../../../components/list_lines';
import { IngestionRssLinesPaginationQuery$variables } from './__generated__/IngestionRssLinesPaginationQuery.graphql';
import type { Theme } from '../../../../components/Theme';

const Transition = React.forwardRef((props: SlideProps, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));
Transition.displayName = 'TransitionSlide';

const useStyles = makeStyles<Theme>((theme) => ({
  item: {
    paddingLeft: 10,
    height: 50,
  },
  itemIcon: {
    color: theme.palette.primary.main,
  },
  bodyItem: {
    height: 20,
    fontSize: 13,
    float: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: 10,
  },
  itemIconDisabled: {
    color: theme.palette.grey?.[700],
  },
}));

interface IngestionRssLineProps {
  node: IngestionRssLine_node$key;
  dataColumns: DataColumns;
  paginationOptions?: IngestionRssLinesPaginationQuery$variables;
}
const ingestionRssLineFragment = graphql`
  fragment IngestionRssLine_node on IngestionRss {
    id
    name
    uri
    ingestion_running
    current_state_date
  }
`;
export const IngestionRssLineComponent: FunctionComponent<IngestionRssLineProps> = ({
  dataColumns,
  node,
  paginationOptions,
}) => {
  const classes = useStyles();
  const { t_i18n, nsdt } = useFormatter();
  const data = useFragment(ingestionRssLineFragment, node);
  return (
    <ListItem classes={{ root: classes.item }} divider={true}>
      <ListItemIcon classes={{ root: classes.itemIcon }}>
        <RssBox />
      </ListItemIcon>
      <ListItemText
        primary={
          <div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.name.width }}
            >
              {data.name}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.uri.width }}
            >
              {data.uri}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.ingestion_running.width }}
            >
              <ItemBoolean
                variant="inList"
                label={data.ingestion_running ? t_i18n('Yes') : t_i18n('No')}
                status={!!data.ingestion_running}
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.current_state_date.width }}
            >
              {nsdt(data.current_state_date)}
            </div>
          </div>
      }
      />
      <ListItemSecondaryAction>
        <Security needs={[INGESTION_SETINGESTIONS]}>
          <IngestionRssPopover
            ingestionRssId={data.id}
            paginationOptions={paginationOptions}
            running={data.ingestion_running}
          />
        </Security>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export const IngestionRssLineDummy = ({ dataColumns }: { dataColumns: DataColumns }) => {
  const classes = useStyles();
  return (
    <ListItem classes={{ root: classes.item }} divider={true}>
      <ListItemIcon classes={{ root: classes.itemIcon }}>
        <Skeleton
          animation="wave"
          variant="circular"
          width={30}
          height={30}
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.name.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="100%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.uri.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="100%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.ingestion_running.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="100%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.current_state_date.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={100}
                height="100%"
              />
            </div>
          </div>
      }
      />
      <ListItemSecondaryAction classes={{ root: classes.itemIconDisabled }}>
        <MoreVert />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
