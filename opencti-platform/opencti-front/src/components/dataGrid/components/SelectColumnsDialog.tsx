import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { useFormatter } from '../../i18n';

interface SelectColumnsDialogProps {
  open: boolean,
  handleClose: () => void,
}

const SelectColumnsDialog: React.FunctionComponent<
  SelectColumnsDialogProps
> = ({
  open,
  handleClose,
}) => {
  const { t_i18n } = useFormatter();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        {t_i18n('Select columns')}
      </DialogTitle>
      <DialogContent>
        {"Hello!"}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
        >
          {t_i18n('Reset')}
        </Button>
        <Button
          onClick={handleClose}
          color="error"
        >
          {t_i18n('Cancel')}
        </Button>
        <Button
          onClick={handleClose}
          color="secondary"
        >
          {t_i18n('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectColumnsDialog;
