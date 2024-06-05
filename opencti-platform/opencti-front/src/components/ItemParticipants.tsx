import React, { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import { Chip, useTheme } from '@mui/material';
import FieldOrEmpty from './FieldOrEmpty';
import useHelper from '../utils/hooks/useHelper';
import useAuth from '../utils/hooks/useAuth';
import ThemeDark from './ThemeDark';
import ThemeLight from './ThemeLight';

interface ItemParticipantsProps {
  participants: {
    readonly entity_type: string
    readonly id: string
    readonly name: string
  }[];
}

const ItemParticipants: FunctionComponent<ItemParticipantsProps> = ({ participants }) => {
  const { palette: { mode } } = useTheme();
  const theme = mode === 'dark'
    ? ThemeDark()
    : ThemeLight();
  const { isFeatureEnable } = useHelper();
  const isMonochromeFeatureEnabled = isFeatureEnable('MONOCHROME_LABELS');
  const { me: { monochrome_labels } } = useAuth();
  const isMonochrome = isMonochromeFeatureEnabled && monochrome_labels;
  return (
    <FieldOrEmpty source={participants}>
      {participants.map((participant) => (isMonochrome
        ? <Chip
            key={participant.id}
            label={participant.name}
            style={{
              backgroundColor: theme.palette.background.accent,
              borderRadius: 4,
              color: theme.palette.chip.main,
            }}
          />
        : <Button
            key={participant.id}
            variant="outlined"
            color="primary"
            size="small"
            style={{ margin: '0 7px 7px 0', cursor: 'default' }}
          >
          {participant.name}
        </Button>
      ))}
    </FieldOrEmpty>
  );
};
export default ItemParticipants;
