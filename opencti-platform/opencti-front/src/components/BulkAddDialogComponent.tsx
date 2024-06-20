/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable @typescript-eslint/indent */
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import React, { useEffect } from 'react';
import { Field } from 'formik';
import { TextFieldsOutlined } from '@mui/icons-material';
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
    const handleSelectChange = (event: any) => {
        setSelectedLocalAttribute(event.target.value);
        console.log('value is: ', event.target.value);
        console.log('LocalSelectAttribute is: ', selectedLocalAttribute);
    };
    useEffect(() => {
        setLocalBulkValueField([bulkValueFieldValue]);
    }, [bulkValueFieldValue]);
    console.log('openBulkAddDialog is: ', openBulkAddDialog);
    return (
        <React.Fragment>
            <IconButton
                onClick={handleOpenBulkAddDialog}
                size="large"
                color="primary" style={{ float: 'left', marginRight: 25 }}
            >
                <TextFieldsOutlined />
            </IconButton>
            <Dialog
                PaperProps={{ elevation: 3 }}
                open={openBulkAddDialog}
                onClose={handleCloseBulkAddDialog}
                fullWidth={true}
            >
                <DialogContent style={{ marginTop: 0, paddingTop: 10 }}>
                    <div id="divSelectAttributes" style={{ border: '2px solid #FFA500', paddingLeft: 10 }}>
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
                    <Typography style={{ float: 'left', marginTop: 10 }}>
                        <span style={{ fontSize: '0.7em' }}>{selectedLocalAttribute}</span>
                        <span className="output"></span>
                    </Typography>
                    <Field
                        component={TextField}
                        id="bulk_hashes_field"
                        variant="standard"
                        key="bulk_hashes_field"
                        value={localBulkValueField}
                        name="bulk_hashes_field"
                        fullWidth={true}
                        multiline={true}
                        rows="5"
                        onChange={(name: any, value: any) => setLocalBulkValueField(value)}
                    />
                    <DialogActions>
                        <Button color="secondary" onClick={() => { handleCloseBulkAddDialog(localBulkValueField); handleParentSelectAttribute(selectedLocalAttribute); }}>
                            {t_i18n('Validate')}
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

export default BulkAddDialogComponent;
