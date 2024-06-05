import { Chip, Tooltip, useTheme } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { useFormatter } from '../../../../components/i18n';
import ThemeDark from '../../../../components/ThemeDark';
import ThemeLight from '../../../../components/ThemeLight';
import useHelper from '../../../../utils/hooks/useHelper';
import useAuth from '../../../../utils/hooks/useAuth';
import { truncate } from '../../../../utils/String';
import { hexToRGB } from '../../../../utils/Colors';

type Label = {
  id: string,
  value?: string | null,
  color?: string | null,
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface StixCoreObjectLabelsProps {
  labels?: Label[] | readonly Label[] | null,
  onClick?: (
    k: string,
    id: string,
    op?: any,
    event?: any,
  ) => void,
  variant?: string,
  revoked?: boolean,
}

const StixCoreObjectLabels: FunctionComponent<StixCoreObjectLabelsProps> = ({
  labels,
  onClick,
  variant,
  revoked = false,
}) => {
  const { t_i18n } = useFormatter();
  const { isFeatureEnable } = useHelper();
  const isMonochromeFeatureEnabled = isFeatureEnable('MONOCHROME_LABELS');
  const { me: { monochrome_labels } } = useAuth();
  const isMonochrome = isMonochromeFeatureEnabled && monochrome_labels;
  const { palette: { mode } } = useTheme();
  const theme = mode === 'dark'
    ? ThemeDark()
    : ThemeLight();
  const hasLabels = !revoked && labels && labels.length > 0;
  let style = {};
  switch (variant) {
    case 'inList':
      style = {
        fontSize: 12,
        height: 20,
        float: 'left',
        margin: '0 7px 0 0',
        borderRadius: 4,
      };
      break;
    case 'inSearch':
      style = {
        height: 25,
        fontSize: 12,
        margin: '0 7px 0 0',
        borderRadius: 4,
      };
      break;
    default:
      style = {
        height: 25,
        fontSize: 12,
        margin: '0 7px 7px 0',
        borderRadius: 4,
      };
  }

  if (hasLabels) {
    return labels.slice(0, 3).map((label) => (
      <Tooltip key={label.id} title={label.value}>
        <Chip
          variant={isMonochrome ? 'filled' : 'outlined'}
          label={truncate(label.value, 25)}
          style={{
            ...style,
            color: isMonochrome ? theme.palette.chip.main : label.color ?? undefined,
            borderColor: isMonochrome ? undefined : label.color ?? undefined,
            backgroundColor: isMonochrome ? theme.palette.background.accent : hexToRGB(label.color),
          }}
          onClick={typeof onClick === 'function'
            ? () => onClick('objectLabel', label.id, 'eq')
            : undefined
          }
        />
      </Tooltip>
    ));
  } if (revoked) {
    return (
      <Chip
        variant={isMonochrome ? 'filled' : 'outlined'}
        label={t_i18n('Revoked')}
        style={{
          ...style,
          color: isMonochrome ? theme.palette.chip.main : '#d32f2f',
          borderColor: isMonochrome ? undefined : '#d32f2f',
          backgroundColor: isMonochrome ? theme.palette.background.accent : 'rgba(211, 47, 47, .1)',
        }}
        onClick={typeof onClick === 'function'
          ? () => onClick('objectLabel', '', 'eq')
          : undefined
        }
      />
    );
  }
  const normalColor = mode === 'dark' ? '#ffffff' : '#000000';
  const normalBackground = mode === 'dark' ? '#ffffff' : 'transparent';
  return (
    <Chip
      variant={isMonochrome ? 'filled' : 'outlined'}
      label={t_i18n('No label')}
      style={{
        ...style,
        color: isMonochrome ? theme.palette.chip.main : normalColor,
        borderColor: isMonochrome ? undefined : normalColor,
        backgroundColor: isMonochrome ? theme.palette.background.accent : normalBackground,
      }}
      onClick={typeof onClick === 'function'
        ? () => onClick('objectLabel', '', 'eq')
        : undefined
        }
    />
  );
};

export default StixCoreObjectLabels;
