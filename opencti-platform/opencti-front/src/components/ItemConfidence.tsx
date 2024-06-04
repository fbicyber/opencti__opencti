import React, { FunctionComponent } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material';
import { useLevel } from '../utils/hooks/useScale';
import { hexToRGB } from '../utils/Colors';
import useHelper from '../utils/hooks/useHelper';
import ThemeDark from './ThemeDark';
import ThemeLight from './ThemeLight';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles(() => ({
  chip: {
    fontSize: 12,
    marginRight: 7,
    borderRadius: 4,
    width: 120,
  },
  chipInList: {
    fontSize: 12,
    height: 20,
    float: 'left',
    borderRadius: 4,
    width: 80,
  },
  label: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

interface ItemConfidenceProps {
  confidence: number | null | undefined,
  variant?: string,
  entityType: string,
}

const ItemConfidence: FunctionComponent<ItemConfidenceProps> = ({ confidence, variant, entityType }) => {
  const classes = useStyles();
  const { palette: { mode } } = useTheme();
  const theme = mode === 'dark'
    ? ThemeDark()
    : ThemeLight();
  const { isFeatureEnable } = useHelper();
  const isMonochromeFeatureEnabled = isFeatureEnable('MONOCHROME_LABELS');
  const { level: confidenceLevel } = useLevel(entityType, 'confidence', confidence);
  const style = variant === 'inList' ? classes.chipInList : classes.chip;
  return (
    <Tooltip title={confidenceLevel.label}>
      <Chip
        classes={{ root: style, label: classes.label }}
        style={{
          color: isMonochromeFeatureEnabled
            ? theme.palette.chip.main
            : confidenceLevel.color,
          borderColor: isMonochromeFeatureEnabled
            ? undefined
            : confidenceLevel.color,
          backgroundColor: isMonochromeFeatureEnabled
            ? theme.palette.background.accent
            : hexToRGB(confidenceLevel.color),
        }}
        label={confidenceLevel.label}
      />
    </Tooltip>
  );
};

export default ItemConfidence;
