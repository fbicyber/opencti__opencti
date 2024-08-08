import React, { FunctionComponent } from 'react';
import Skeleton from '@mui/material/Skeleton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import makeStyles from '@mui/styles/makeStyles';
import { MoreVert } from '@mui/icons-material';
import { ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { graphql, useFragment } from 'react-relay';
import { MarkingDefinitionLine_node$key } from './__generated__/MarkingDefinitionLine_node.graphql';
import ItemIcon from '../../../../components/ItemIcon';
import { useFormatter } from '../../../../components/i18n';
import type { Theme } from '../../../../components/Theme';
import MarkingDefinitionPopover from './MarkingDefinitionPopover';
import { MarkingDefinitionsLinesPaginationQuery$variables } from './__generated__/MarkingDefinitionsLinesPaginationQuery.graphql';

const useStyles = makeStyles<Theme>((theme) => ({
  item: {
    paddingLeft: 10,
    height: 50,
    cursor: 'default',
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

export type MarkingDefinitionDataColumnsType = {
  definition_type: {
    label: string;
    width: string;
    isSortable: boolean;
  };
  definition: {
    label: string;
    width: string;
    isSortable: boolean;
  };
  x_opencti_color: {
    label: string;
    width: string;
    isSortable: boolean;
  };
  x_opencti_order: {
    label: string;
    width: string;
    isSortable: boolean;
  };
  created: {
    label: string;
    width: string;
    isSortable: boolean;
  };
};

interface MarkingDefinitionLineProps {
  node: MarkingDefinitionLine_node$key;
  dataColumns: MarkingDefinitionDataColumnsType;
  paginationOptions: MarkingDefinitionsLinesPaginationQuery$variables;
}

const markingDefinitionLineFragment = graphql`
  fragment MarkingDefinitionLine_node on MarkingDefinition {
    id
    definition_type
    definition
    x_opencti_order
    x_opencti_color
    created
    modified
  }
`;

export const MarkingDefinitionLine: FunctionComponent<MarkingDefinitionLineProps> = ({
  node,
  dataColumns,
  paginationOptions,
}) => {
  const classes = useStyles();
  const { fd } = useFormatter();
  const markingDefinition = useFragment(markingDefinitionLineFragment, node);
  return (
    <ListItemButton
      key={markingDefinition.id}
      classes={{ root: classes.item }}
      divider={true}
      component={Link}
      to={`/dashboard/settings/accesses/markingDefinitions/${markingDefinition.id}`}
    >
      <ListItemIcon>
        <ItemIcon type="Marking-Definition" color={markingDefinition.x_opencti_color} />
      </ListItemIcon>
      <ListItemText
        primary={
          <div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.definition_type.width }}
            >
              {markingDefinition.definition_type}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.definition.width }}
            >
              {markingDefinition.definition}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.x_opencti_color.width }}
            >
              {markingDefinition.x_opencti_color}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.x_opencti_order.width }}
            >
              {markingDefinition.x_opencti_order}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.created.width }}
            >
              {fd(markingDefinition.created)}
            </div>
          </div>
        }
      />
      <ListItemSecondaryAction>
        <MarkingDefinitionPopover
          markingDefinitionId={markingDefinition.id}
          paginationOptions={paginationOptions}
        />
      </ListItemSecondaryAction>
    </ListItemButton>
  );
};

interface MarkingDefinitionLineDummyProps {
  dataColumns: MarkingDefinitionDataColumnsType;
}

export const MarkingDefinitionLineDummy: FunctionComponent<
MarkingDefinitionLineDummyProps
> = ({ dataColumns }) => {
  const classes = useStyles();
  return (
    <ListItem classes={{ root: classes.item }} divider={true}>
      <ListItemIcon classes={{ root: classes.itemIconDisabled }}>
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
              style={{ width: dataColumns.definition_type.width }}
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
              style={{ width: dataColumns.definition.width }}
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
              style={{ width: dataColumns.x_opencti_color.width }}
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
              style={{ width: dataColumns.x_opencti_order.width }}
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
              style={{ width: dataColumns.created.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
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
