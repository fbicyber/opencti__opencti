import React, { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import { Chip, useTheme } from '@mui/material';
import useHelper from '../utils/hooks/useHelper';
import useAuth from '../utils/hooks/useAuth';
import ThemeDark from './ThemeDark';
import ThemeLight from './ThemeLight';

type Node = {
  readonly entity_type: string;
  readonly id: string;
  readonly name: string;
};

type Props = {
  assignees: ReadonlyArray<Node>;
};

const ItemAssignees: FunctionComponent<Props> = ({ assignees }) => {
  const { palette: { mode } } = useTheme();
  const theme = mode === 'dark'
    ? ThemeDark()
    : ThemeLight();
  const { isFeatureEnable } = useHelper();
  const isMonochromeFeatureEnabled = isFeatureEnable('MONOCHROME_LABELS');
  const { me: { monochrome_labels } } = useAuth();
  const isMonochrome = isMonochromeFeatureEnabled && monochrome_labels;
  return (
    <div>
      {assignees.length > 0
        ? assignees.map((assignee) => (isMonochrome
          ? <Chip
              key={assignee.id}
              label={assignee.name}
              style={{
                backgroundColor: theme.palette.background.accent,
                borderRadius: 4,
                color: theme.palette.chip.main,
              }}
            />
          : <Button
              key={assignee.id}
              variant="outlined"
              color="primary"
              size="small"
              style={{ margin: '0 7px 7px 0', cursor: 'default' }}
            >
            {assignee.name}
          </Button>
        ))
        : '-'}
    </div>
  );
};

export default ItemAssignees;
