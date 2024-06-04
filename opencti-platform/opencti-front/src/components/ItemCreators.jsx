import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Chip, useTheme } from '@mui/material';
import Security from '../utils/Security';
import { SETTINGS_SETACCESSES } from '../utils/hooks/useGranted';
import useHelper from '../utils/hooks/useHelper';
import ThemeDark from './ThemeDark';
import ThemeLight from './ThemeLight';

const systemUsers = [
  '6a4b11e1-90ca-4e42-ba42-db7bc7f7d505', // SYSTEM
  '82ed2c6c-eb27-498e-b904-4f2abc04e05f', // RETENTION MANAGER
  'c49fe040-2dad-412d-af07-ce639204ad55', // AUTOMATION MANAGER
  'f9d7b43f-b208-4c56-8637-375a1ce84943', // RULE MANAGER
  '31afac4e-6b99-44a0-b91b-e04738d31461', // REDACTED USER
];

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles(() => ({
  button: {
    margin: '0 7px 7px 0',
  },
}));

const ItemCreators = (props) => {
  const { palette: { mode } } = useTheme();
  const theme = mode === 'dark'
    ? ThemeDark()
    : ThemeLight();
  const { isFeatureEnable } = useHelper();
  const isMonochromeFeatureEnabled = isFeatureEnable('MONOCHROME_LABELS');
  const { creators } = props;
  const classes = useStyles();

  const systemUserDisplay = (name) => (isMonochromeFeatureEnabled
    ? <Chip
        style={{
          backgroundColor: theme.palette.background.accent,
          color: theme.palette.chip.main,
        }}
        label={name}
      />
    : <Button
        variant="outlined"
        size="small"
        classes={{ root: classes.button }}
        style={{ cursor: 'default' }}
      >
      {name}
    </Button>);

  return (
    <>
      {creators.map((creator) => {
        return (
          <Security
            key={creator.id}
            needs={[SETTINGS_SETACCESSES]}
            placeholder={
              <Button
                variant={isMonochromeFeatureEnabled ? 'text' : 'outlined'}
                size="small"
                classes={{ root: classes.button }}
                style={{ cursor: 'default' }}
              >
                {creator.name}
              </Button>
            }
          >
            {systemUsers.includes(creator.id)
              ? (systemUserDisplay(creator.name))
              : (<Button
                  variant={isMonochromeFeatureEnabled ? 'text' : 'outlined'}
                  size="small"
                  classes={{ root: classes.button }}
                  component={Link}
                  to={`/dashboard/settings/accesses/users/${creator.id}`}
                 >
                {creator.name}
              </Button>
              )
            }
          </Security>
        );
      })}
    </>
  );
};

export default ItemCreators;
