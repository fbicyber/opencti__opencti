import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useFormatter } from '../../../../components/i18n';
import UserHistory from './UserHistory';
import useGranted, { SETTINGS_SECURITYACTIVITY } from '../../../../utils/hooks/useGranted';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

interface UserHistoryTabProps {
  userId: string;
}

const UserHistoryTab: React.FC<UserHistoryTabProps> = ({ userId }) => {
  const [itemCount, setItemCount] = useState(10);
  const [historyTab, setHistoryTab] = useState(false);
  const isGrantedToAudit = useGranted([SETTINGS_SECURITYACTIVITY]);
  const { t_i18n } = useFormatter();

  const handleChange = (event: SelectChangeEvent<number>) => {
    setItemCount(Number(event.target.value));
    setHistoryTab(true);
  };

  return (
    <Box>
      <Box>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="user-history-item-count-label">Items</InputLabel>
          <Select
            labelId="user-history-item-count-label"
            id="user-history-item-count"
            value={itemCount}
            label="Items"
            onChange={handleChange}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {isGrantedToAudit ? (
        <UserHistory userId={userId} itemCount={itemCount} historyTab={historyTab}/>
      ) : (
        <Paper
          variant='outlined'
          sx={{
            p: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 150,
          }}
        >
          {t_i18n('You are not authorized to see this data.')}
        </Paper>
      )}
    </Box>
  );
};

export default UserHistoryTab;