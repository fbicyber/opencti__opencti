import React, { FunctionComponent } from 'react';
import Skeleton from '@mui/material/Skeleton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import makeStyles from '@mui/styles/makeStyles';
import { MoreVert } from '@mui/icons-material';
import { ListItemButton } from '@mui/material';
import { graphql, useFragment } from 'react-relay';
import KillChainPhasePopover from './KillChainPhasePopover';
import { KillChainPhaseLine_node$key } from './__generated__/KillChainPhaseLine_node.graphql';
import ItemIcon from '../../../../components/ItemIcon';
import { useFormatter } from '../../../../components/i18n';
import type { Theme } from '../../../../components/Theme';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
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

export type DataColumnsType = {
  kill_chain_name: {
    label: string;
    width: string;
    isSortable: boolean;
  };
  phase_name: {
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

export const KillChainPhaseLineFragment = graphql`
  fragment KillChainPhaseLine_node on KillChainPhase {
    id
    kill_chain_name
    phase_name
    x_opencti_order
    created
    modified
  }
`;

interface KillChainPhaseLineProps {
  node: KillChainPhaseLine_node$key;
  dataColumns: DataColumnsType;
  paginationOptions: { search: string; orderMode: string; orderBy: string };
}

const KillChainPhaseLine: FunctionComponent<KillChainPhaseLineProps> = ({
  node,
  dataColumns,
  paginationOptions,
}) => {
  const classes = useStyles();
  const { fd } = useFormatter();
  const data = useFragment(KillChainPhaseLineFragment, node);
  return (
    <ListItemButton classes={{ root: classes.item }} divider={true}>
      <ListItemIcon>
        <ItemIcon type="Kill-Chain-Phase" />
      </ListItemIcon>
      <ListItemText
        primary={
          <div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.kill_chain_name.width }}
            >
              {data.kill_chain_name}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.phase_name.width }}
            >
              {data.phase_name}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.x_opencti_order.width }}
            >
              {data.x_opencti_order}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.created.width }}
            >
              {fd(data.created)}
            </div>
          </div>
        }
      />
      <ListItemSecondaryAction>
        <KillChainPhasePopover
          killChainPhaseId={data.id}
          paginationOptions={paginationOptions}
        />
      </ListItemSecondaryAction>
    </ListItemButton>
  );
};

interface KillChainPhaseLineDummyProps {
  dataColumns: DataColumnsType;
}

export const KillChainPhaseLineDummy: FunctionComponent<
KillChainPhaseLineDummyProps
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
              style={{ width: dataColumns.kill_chain_name.width }}
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
              style={{ width: dataColumns.phase_name.width }}
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
                width={140}
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

export default KillChainPhaseLine;
