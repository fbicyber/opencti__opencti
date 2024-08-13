import React, { FunctionComponent } from 'react';
import { graphql, useFragment } from 'react-relay';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { MoreVert } from '@mui/icons-material';
import { DatabaseExportOutline } from 'mdi-material-ui';
import Slide, { SlideProps } from '@mui/material/Slide';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';
import TaxiiPopover from './TaxiiPopover';
import FilterIconButton from '../../../../components/FilterIconButton';
import ItemCopy from '../../../../components/ItemCopy';
import { deserializeFilterGroupForFrontend } from '../../../../utils/filters/filtersUtils';
import { TAXIIAPI_SETCOLLECTIONS } from '../../../../utils/hooks/useGranted';
import Security from '../../../../utils/Security';
import type { Theme } from '../../../../components/Theme';
import { TaxiiLine_node$key } from './__generated__/TaxiiLine_node.graphql';
import { DataColumns } from '../../../../components/list_lines';
import { TaxiiLinesPaginationQuery$variables } from './__generated__/TaxiiLinesPaginationQuery.graphql';

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
  filter: {
    fontSize: 12,
    lineHeight: '12px',
    height: 20,
    marginRight: 7,
    borderRadius: 10,
  },
}));

interface TaxiiLineProps {
  node: TaxiiLine_node$key;
  dataColumns: DataColumns;
  paginationOptions: TaxiiLinesPaginationQuery$variables;
}
const TaxiiLineFragment = graphql`
  fragment TaxiiLine_node on TaxiiCollection {
    id
    name
    description
    filters
  }
`;

export const TaxiiLineComponent: FunctionComponent<TaxiiLineProps> = ({
  dataColumns,
  node,
  paginationOptions,
}) => {
  const classes = useStyles();
  const data = useFragment(TaxiiLineFragment, node);
  const filters = deserializeFilterGroupForFrontend(data.filters);
  return (
    <ListItem
      classes={{ root: classes.item }}
      divider={true}
      component="a"
      href={`/taxii2/root/collections/${data.id}/objects`}
      target={'_blank'} // open in new tab
    >
      <ListItemIcon classes={{ root: classes.itemIcon }}>
        <DatabaseExportOutline />
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
              className={classes.filtersItem}
              style={{ width: dataColumns.filters.width }}
            >
              <FilterIconButton
                filters={filters}
                dataColumns={dataColumns}
                styleNumber={3}
              />
            </div>
          </>
        }
      />
      <ListItemSecondaryAction>
        <Security needs={[TAXIIAPI_SETCOLLECTIONS]}>
          <TaxiiPopover
            taxiiCollectionId={data.id}
            paginationOptions={paginationOptions}
          />
        </Security>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export const TaxiiLineDummy = ({ dataColumns }: { dataColumns: DataColumns }) => {
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
          <>
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
              style={{ width: dataColumns.filters.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="50%"
              />
            </div>
          </>
          }
      />
      <ListItemSecondaryAction classes={{ root: classes.itemIconDisabled }}>
        <MoreVert />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
