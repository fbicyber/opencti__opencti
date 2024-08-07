import React, { FunctionComponent } from 'react';
import Skeleton from '@mui/material/Skeleton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import makeStyles from '@mui/styles/makeStyles';
import { CheckCircleOutlined, DoNotDisturbOnOutlined, KeyboardArrowRightOutlined, ReportGmailerrorred } from '@mui/icons-material';
import { ListItemButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { graphql, useFragment } from 'react-relay';
import { GroupLine_node$key } from './__generated__/GroupLine_node.graphql';
import ItemIcon from '../../../../components/ItemIcon';
import { useFormatter } from '../../../../components/i18n';
import type { Theme } from '../../../../components/Theme';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
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

export type GroupDataColumnsType = {
  name: {
    label: string;
    width: string;
    isSortable: boolean;
  };
  default_assignation: {
    label: string;
    width: string;
    isSortable: boolean;
  };
  auto_new_marking: {
    label: string;
    width: string;
    isSortable: boolean;
  };
  no_creators: {
    label: string;
    width: string;
    isSortable: boolean;
  };
  group_confidence_level: {
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

const GroupLineFragment = graphql`
  fragment GroupLine_node on Group {
    id
    name
    default_assignation
    no_creators
    auto_new_marking
    group_confidence_level {
      max_confidence
    }
    created_at
    updated_at
  }
`;

interface GroupLineProps {
  dataColumns: GroupDataColumnsType
  node: GroupLine_node$key
}

export const GroupLine: FunctionComponent<GroupLineProps> = ({
  node,
  dataColumns,
}) => {
  const classes = useStyles();
  const { t_i18n, fd } = useFormatter();
  const group = useFragment(GroupLineFragment, node);

  return (
    <ListItemButton
      key={group.id}
      classes={{ root: classes.item }}
      divider={true}
      component={Link}
      to={`/dashboard/settings/accesses/groups/${group.id}`}
    >
      <ListItemIcon>
        <ItemIcon type="Group" />
      </ListItemIcon>
      <ListItemText
        primary={
          <>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.name.width }}
            >
              {group.name}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.default_assignation.width }}
            >
              {group.default_assignation ? (
                <CheckCircleOutlined fontSize="small" color="success"/>
              ) : (
                <DoNotDisturbOnOutlined fontSize="small" color="primary"/>
              )}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.auto_new_marking.width }}
            >
              {group.auto_new_marking ? (
                <CheckCircleOutlined fontSize="small" color="success"/>
              ) : (
                <DoNotDisturbOnOutlined fontSize="small" color="primary"/>
              )}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.no_creators.width }}
            >
              {group.no_creators ? (
                <CheckCircleOutlined fontSize="small" color="success"/>
              ) : (
                <DoNotDisturbOnOutlined fontSize="small" color="primary"/>
              )}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.group_confidence_level.width }}
            >
              {group.group_confidence_level?.max_confidence ?? (
                <Tooltip
                  title={t_i18n('This group does not have a Max Confidence Level, members might not be able to create data.')}
                >
                  <ReportGmailerrorred fontSize={'small'} color={'error'}/>
                </Tooltip>
              )}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.created_at.width }}
            >
              {fd(group.created_at)}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.updated_at.width }}
            >
              {fd(group.updated_at)}
            </div>
          </>
        }
      />
      <ListItemIcon classes={{ root: classes.goIcon }}>
        <KeyboardArrowRightOutlined/>
      </ListItemIcon>
    </ListItemButton>
  );
};

interface GroupLineDummyProps {
  dataColumns: GroupDataColumnsType;
}

export const GroupLineDummy: FunctionComponent<
GroupLineDummyProps
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
              style={{ width: dataColumns.default_assignation.width }}
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
              style={{ width: dataColumns.auto_new_marking.width }}
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
              style={{ width: dataColumns.group_confidence_level.width }}
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
        <KeyboardArrowRightOutlined/>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
