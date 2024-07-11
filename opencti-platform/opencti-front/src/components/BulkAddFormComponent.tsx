
import Button from '@mui/material/Button';
import React, { useEffect } from 'react';
import { Grid, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import { useFormatter } from './i18n';
import TextField from '@mui/material/TextField';

type BulkAddFormComponentProps = {
  bulkValueFieldValue: string
  handleCloseBulkAddForm: (val: any) => void
  handleParentSelectAttribute: (val: any) => void
};

const BulkAddFormComponent: React.FC<BulkAddFormComponentProps> = ({
  bulkValueFieldValue,
  handleCloseBulkAddForm,
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
  const handleTextChange = (event: any) => {
    setLocalBulkValueField(event.target.value);
    monitorBulkValue(event.target.value);
    console.log('LocalBulkValueField is ', localBulkValueField);
  };
  useEffect(() => {
    setLocalBulkValueField([bulkValueFieldValue]);
  }, [bulkValueFieldValue]);
  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <h2 style={{ color: 'blue', }}>
            {t_i18n('Add Multiple Observable Values')}
          </h2>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={12}>
          <div style={{ fontSize: '13px', paddingBottom: '20px' }}>
            {t_i18n('Enter one observable per line. Observables must be the same type')}
            <br></br>
            {t_i18n('If you are adding more than 50 values, please upload them through')} <a href='/dashboard/data/import'>{t_i18n('Imports')}</a>.
          </div>
        </Grid>
        <Grid item xs={12}>
          <div id="divSelectAttributes" style={{ paddingBottom: 15, width: 15 }}>
            <Select
              name="attributes"
              id="attributes"
              value={selectedLocalAttribute}
              onChange={handleSelectChange}
            >
              <MenuItem selected disabled>Select attribute</MenuItem>
              <MenuItem value="NAME">name</MenuItem>
              <MenuItem value="MD5">md5</MenuItem>
              <MenuItem value="SHA-1">sha1</MenuItem>
              <MenuItem value="SHA-256">sha256</MenuItem>
              <MenuItem value="SHA-512">sha512</MenuItem>
            </Select>
          </div>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="bulk_hashes_field"
            label={t_i18n('Multiple Values')}
            variant="outlined"
            value={localBulkValueField}
            key="bulk_hashes_field"
            name="bulk_hashes_field"
            fullWidth={true}
            multiline={true}
            rows="5"
            onChange={handleTextChange}
          />
        </Grid>
        <Grid item xs={8}>
          {warningVisible
            && (<div style={{ color: 'red' }}>{t_i18n('Remove values or please upload them through')} <a href='/dashboard/data/import'>{t_i18n('Imports')}</a>.</div>)}
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleCloseBulkAddForm}>
            {t_i18n('Cancel')}
          </Button>
        </Grid>
        <Grid item xs={2}>
          {!warningVisible && (<Button color="secondary" onClick={() => { handleCloseBulkAddForm(localBulkValueField); handleParentSelectAttribute(selectedLocalAttribute); }}>
            {t_i18n('Continue')}
          </Button>)}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default BulkAddFormComponent;
