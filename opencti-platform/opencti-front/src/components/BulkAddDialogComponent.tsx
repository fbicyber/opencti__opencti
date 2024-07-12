import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import React, { useEffect } from 'react';
import { Field } from 'formik';
import { MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import { useFormatter } from './i18n';
import TextField from './TextField';

type BulkAddDialogComponentProps = {
  openBulkAddDialog: boolean
  bulkValueFieldValue: string
  handleOpenBulkAddDialog: () => void
  handleCloseBulkAddDialog: (val: any) => void
  handleParentSelectAttribute: (val: any) => void
};

const BulkAddDialogComponent: React.FC<BulkAddDialogComponentProps> = ({
  openBulkAddDialog,
  bulkValueFieldValue,
  handleOpenBulkAddDialog,
  handleCloseBulkAddDialog,
  handleParentSelectAttribute,
}) => {
  const { t_i18n } = useFormatter();
  const [localBulkValueField, setLocalBulkValueField] = React.useState(['']);
  const [selectedLocalAttribute, setSelectedLocalAttribute] = React.useState('');
  const [warningVisible, setWarningVisible] = React.useState(false);

  function monitorBulkValue(value: string[]) {
    const observable_lines = value.toString().split('\n');
    // 50 lines have been entered based on \n newlines - warn user and remove Continue button.
    if (observable_lines.length >= 51) {
      if (warningVisible === false) {
        setWarningVisible(true);
      }
    } else if (warningVisible === true) {
      setWarningVisible(false);
    }
  }
  const handleSelectChange = (event: any) => {
    setSelectedLocalAttribute(event.target.value);
  };
  useEffect(() => {
    setLocalBulkValueField([bulkValueFieldValue]);
  }, [bulkValueFieldValue]);
  return (
    <React.Fragment>
      <Button
        onClick={handleOpenBulkAddDialog}
        variant={'outlined'}
        size={'small'}
        aria-label={'edit_values_button'}
        aria-labelledby={'edit_values_button'}
        style={{ float: 'right', marginRight: 5, marginTop: 10 }}
      >
        {t_i18n('Edit Values')}
      </Button>
      <Dialog
        PaperProps={{ elevation: 3 }}
        fullWidth={true}
        open={openBulkAddDialog}
        onClose={handleCloseBulkAddDialog}
      >
        <DialogTitle>{t_i18n('Add Multiple Observable Values')}</DialogTitle>
        <DialogContent style={{ marginTop: 0, paddingTop: 10 }}>
          <Typography style={{ float: 'left', marginTop: 10 }}>
            <span className="output"></span>
          </Typography>
          <Typography variant="subtitle1" style={{ whiteSpace: 'pre-line' }}>
            <div style={{ fontSize: '13px', paddingBottom: '20px' }}>
              {t_i18n('Enter one observable per line. Observables must be the same type.')}
              <br></br>
              {t_i18n('If you are adding more than 50 values, please upload them through')} <a href='/dashboard/data/import'>{t_i18n('Imports')}</a>.
            </div>
          </Typography>
          <div id="divSelectAttributes" style={{ paddingBottom: 15 }}>
            {t_i18n('Create Entities from multiple: ')}
            <Select name="attributes" id="attributes" value={selectedLocalAttribute} onChange={handleSelectChange}>
              <MenuItem selected disabled>Select attribute</MenuItem>
              <MenuItem value="NAME">name</MenuItem>
              <MenuItem value="MD5">md5</MenuItem>
              <MenuItem value="SHA-1">sha1</MenuItem>
              <MenuItem value="SHA-256">sha256</MenuItem>
              <MenuItem value="SHA-512">sha512</MenuItem>
            </Select>
          </div>
          <div />
          <Field
            component={TextField}
            id="bulk_hashes_field"
            label={t_i18n('Multiple Values')}
            variant="outlined"
            value={localBulkValueField}
            key="bulk_hashes_field"
            name="bulk_hashes_field"
            fullWidth={true}
            multiline={true}
            rows="5"
            onChange={(name: string, value: string[]) => { setLocalBulkValueField(value); monitorBulkValue(value); }}
          />
          {warningVisible
            && (<div style={{ color: 'red' }}>{t_i18n('Remove values or please upload them through')} <a href='/dashboard/data/import'>{t_i18n('Imports')}</a>.</div>)}
          <DialogActions>
            <Button onClick={handleCloseBulkAddDialog}>
              {t_i18n('Cancel')}
            </Button>
            {!warningVisible && (<Button color="secondary" onClick={() => { handleCloseBulkAddDialog(localBulkValueField); handleParentSelectAttribute(selectedLocalAttribute); }}>
              {t_i18n('Continue')}
            </Button>)}
          </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default BulkAddDialogComponent;
