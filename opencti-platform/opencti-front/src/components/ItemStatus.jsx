import React from 'react';
import * as PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Chip from '@mui/material/Chip';
import { compose } from 'ramda';
import { useTheme } from '@mui/material';
import inject18n from './i18n';
import { hexToRGB } from '../utils/Colors';
import useHelper from '../utils/hooks/useHelper';
import useAuth from '../utils/hooks/useAuth';

const styles = () => ({
  chip: {
    fontSize: 12,
    lineHeight: '12px',
    height: 25,
    marginRight: 7,
    textTransform: 'uppercase',
    borderRadius: 4,
    width: 100,
  },
  chipInList: {
    fontSize: 12,
    lineHeight: '12px',
    height: 20,
    float: 'left',
    textTransform: 'uppercase',
    borderRadius: 4,
    width: 80,
  },
});

const ItemStatus = (props) => {
  const { isFeatureEnable } = useHelper();
  const isMonochromeFeatureEnabled = isFeatureEnable('MONOCHROME_LABELS');
  const { me: { monochrome_labels } } = useAuth();
  const isMonochrome = isMonochromeFeatureEnabled && monochrome_labels;
  const theme = useTheme();
  const { classes, t, status, variant, disabled } = props;
  const style = variant === 'inList' ? classes.chipInList : classes.chip;
  if (status && status.template) {
    return (
      <Chip
        classes={{ root: style }}
        variant={isMonochrome ? 'contained' : 'outlined'}
        label={status.template.name}
        style={{
          color: isMonochrome
            ? theme.palette.chip.main
            : status.template.color,
          borderColor: isMonochrome
            ? undefined
            : status.template.color,
          backgroundColor: isMonochrome
            ? theme.palette.background.accent
            : hexToRGB(status.template.color),
        }}
      />
    );
  }
  return (
    <Chip
      classes={{ root: style }}
      variant={isMonochrome ? 'contained' : 'outlined'}
      label={disabled ? t('Disabled') : t('Unknown')}
      style={{
        backgroundColor: isMonochrome
          ? theme.palette.background.accent
          : undefined,
      }}
    />
  );
};

ItemStatus.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.object,
  variant: PropTypes.string,
  t: PropTypes.func,
  disabled: PropTypes.bool,
};

export default compose(inject18n, withStyles(styles))(ItemStatus);
