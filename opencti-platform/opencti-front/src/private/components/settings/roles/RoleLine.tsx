import React, { FunctionComponent } from 'react';
import Skeleton from '@mui/material/Skeleton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import makeStyles from '@mui/styles/makeStyles';
import { KeyboardArrowRightOutlined } from '@mui/icons-material';
import { ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { graphql, useFragment } from 'react-relay';
import { RoleLine_node$key } from './__generated__/RoleLine_node.graphql';
import ItemIcon from '../../../../components/ItemIcon';
import { useFormatter } from '../../../../components/i18n';
import type { Theme } from '../../../../components/Theme';
import { QueryRenderer } from '../../../../relay/environment';
import { groupsSearchQuery } from '../Groups';
import { GroupsSearchQuery$data } from '../__generated__/GroupsSearchQuery.graphql';

const useStyles = makeStyles<Theme>((theme) => ({
  item: {
    paddingLeft: 10,
    height: 50,
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
  goIcon: {
    position: 'absolute',
    right: -10,
  },
  itemIconDisabled: {
    color: theme.palette.grey?.[700],
  },
}));

export type RoleDataColumnsType = {
  name: {
    label: string;
    width: string;
    isSortable: boolean;
  };
  groups: {
    label: string;
    width: string;
    isSortable: boolean;
  };
  created_at: {
    label: string;
    width: string;
    isSortable: boolean;
  };
  updated_at: {
    label: string;
    width: string;
    isSortable: boolean;
  };
};

interface RoleLineProps {
  node: RoleLine_node$key;
  dataColumns: RoleDataColumnsType;
}

const RoleLineFragment = graphql`
  fragment RoleLine_node on Role {
    id
    name
    created_at
    updated_at
  }
`;

const RoleLine: FunctionComponent<RoleLineProps> = ({
  node,
  dataColumns,
}) => {
  const classes = useStyles();
  const { fd } = useFormatter();
  const role = useFragment(RoleLineFragment, node);

  return (
    <ListItemButton
      key={role.id}
      classes={{ root: classes.item }}
      divider={true}
      component={Link}
      to={`/dashboard/settings/accesses/roles/${role.id}`}
    >
      <ListItemIcon>
        <ItemIcon type="Role" />
      </ListItemIcon>
      <ListItemText
        primary={
          <div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.name.width }}
            >
              {role.name}
            </div>
            <QueryRenderer
              query={groupsSearchQuery}
              variables={{
                count: 50,
                orderBy: 'name',
                orderMode: 'asc',
              }}
              render={({ props }: { props: GroupsSearchQuery$data }) => {
                if (props?.groups?.edges) {
                  const groupIds = props.groups.edges.map((group) => (group?.node.roles?.edges?.map((groupRole) => groupRole.node.id).includes(role.id)
                    ? group.node.id
                    : null));
                  const numberOfGroups = groupIds.filter(
                    (id) => id !== null,
                  ).length;
                  return (
                    <div
                      className={classes.bodyItem}
                      style={{ width: dataColumns.groups.width }}
                    >
                      {numberOfGroups}
                    </div>
                  );
                }
                return (
                  <div
                    className={classes.bodyItem}
                    style={{ width: dataColumns.groups.width }}
                  ></div>
                );
              }}
            />
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.created_at.width }}
            >
              {fd(role.created_at)}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.updated_at.width }}
            >
              {fd(role.updated_at)}
            </div>
          </div>
        }
      />
      <ListItemIcon classes={{ root: classes.goIcon }}>
        <KeyboardArrowRightOutlined />
      </ListItemIcon>
    </ListItemButton>
  );
};

interface RoleLineDummyProps {
  dataColumns: RoleDataColumnsType;
}

export const RoleLineDummy: FunctionComponent<
RoleLineDummyProps
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
              style={{ width: dataColumns.groups.width }}
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
              style={{ width: dataColumns.created_at.width }}
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
              style={{ width: dataColumns.updated_at.width }}
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
        <KeyboardArrowRightOutlined />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default RoleLine;
