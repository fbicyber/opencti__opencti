import React, { FunctionComponent } from 'react';
import { graphql, useFragment } from 'react-relay';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { MoreVert, Stream } from '@mui/icons-material';
import Slide, { SlideProps } from '@mui/material/Slide';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';
import { DataColumns } from '../../../../components/list_lines';
import StreamPopover from './StreamPopover';
import { useFormatter } from '../../../../components/i18n';
import FilterIconButton from '../../../../components/FilterIconButton';
import ItemCopy from '../../../../components/ItemCopy';
import ItemBoolean from '../../../../components/ItemBoolean';
import { deserializeFilterGroupForFrontend } from '../../../../utils/filters/filtersUtils';
import Security from '../../../../utils/Security';
import { TAXIIAPI_SETCOLLECTIONS } from '../../../../utils/hooks/useGranted';
import type { Theme } from '../../../../components/Theme';
import { StreamLine_node$key } from './__generated__/StreamLine_node.graphql';
import { StreamLinesPaginationQuery$variables } from './__generated__/StreamLinesPaginationQuery.graphql';

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
    height: 40,
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    float: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: 10,
  },
  filtersItem: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    float: 'left',
    paddingRight: 10,
  },
  itemIconDisabled: {
    color: theme.palette.grey?.[700],
  },
}));

interface StreamLineProps {
  node: StreamLine_node$key;
  dataColumns: DataColumns;
  paginationOptions?: StreamLinesPaginationQuery$variables;
}

const StreamLineFragment = graphql`
      fragment StreamLine_node on StreamCollection {
      id
      name
      description
      filters
      stream_public
      stream_live
      ...StreamCollectionEdition_streamCollection
    }
`;

export const StreamLineComponent: FunctionComponent<StreamLineProps> = ({
  dataColumns,
  node,
  paginationOptions,
}) => {
  const classes = useStyles();
  const { t_i18n } = useFormatter();
  const data = useFragment(StreamLineFragment, node);
  const filters = deserializeFilterGroupForFrontend(data.filters);
  return (
    <ListItem
      classes={{ root: classes.item }}
      divider={true}
      button={true}
      component="a"
      href={`/stream/${data.id}`}
      target={'_blank'}
    >
      <ListItemIcon classes={{ root: classes.itemIcon }}>
        <Stream />
      </ListItemIcon>
      <ListItemText
        primary={
          <>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.name.width }}
            >
              {data.name}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.description.width }}
            >
              {data.description}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.id.width, paddingRight: 10 }}
            >
              <ItemCopy content={data.id} variant="inLine" />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.stream_public.width }}
            >
              <ItemBoolean
                variant="inList"
                label={data.stream_public ? t_i18n('Yes') : t_i18n('No')}
                status={data.stream_public}
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.stream_live.width }}
            >
              <ItemBoolean
                variant="inList"
                label={data.stream_live ? t_i18n('Started') : t_i18n('Stopped')}
                status={data.stream_live}
              />
            </div>
            <div
              className={classes.filtersItem}
              style={{ width: dataColumns.filters.width }}
            >
              <FilterIconButton
                filters={filters}
                dataColumns={dataColumns}
                styleNumber={3}
                entityTypes={['Stix-Filtering']}
              />
            </div>
          </>
          }
      />
      <ListItemSecondaryAction>
        <Security needs={[TAXIIAPI_SETCOLLECTIONS]}>
          <StreamPopover
            streamCollection={node}
            paginationOptions={paginationOptions}
          />
        </Security>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export const StreamLineDummy = ({ dataColumns }: { dataColumns: DataColumns }) => {
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
                height="50%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.description.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="50%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.id.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="50%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.stream_public.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="50%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.stream_live.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="50%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.filters.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="50%"
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
