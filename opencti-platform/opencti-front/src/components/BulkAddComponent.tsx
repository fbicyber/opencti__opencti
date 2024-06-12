/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable @typescript-eslint/indent */
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import React, { useEffect } from 'react';
import { Field } from 'formik';
import { TextFieldsOutlined } from '@mui/icons-material';
import { useFormatter } from './i18n';
import TextField from './TextField';

type BulkAddComponentProps = {
    openBulkModal: boolean
    bulkValueFieldValue: string
    handleOpenBulkModal: () => void
    handleCloseBulkModal: (val : any) => void
    localHandleCancelClearBulkModal: () => void
};

const BulkAddComponent: React.FC<BulkAddComponentProps> = ({
    openBulkModal,
    bulkValueFieldValue,
    handleOpenBulkModal,
    handleCloseBulkModal,
    localHandleCancelClearBulkModal,
}) => {
    const { t_i18n } = useFormatter();
    const [localBulkValueField, setLocalBulkValueField] = React.useState(['']);
    useEffect(() => {
        setLocalBulkValueField([bulkValueFieldValue]);
    }, [bulkValueFieldValue]);
    return (
        <React.Fragment>
            <IconButton
                onClick={handleOpenBulkModal}
                size="large"
                color="primary" style={{ float: 'right', marginRight: 25 }}
            >
                <TextFieldsOutlined />
            </IconButton>
            <Dialog
                PaperProps={{ elevation: 3 }}
                open={openBulkModal}
                fullWidth={true}
                onClose={localHandleCancelClearBulkModal}
            >
                <DialogTitle>{t_i18n('Bulk Observable Creation')}</DialogTitle>
                <DialogContent style={{ marginTop: 0, paddingTop: 0 }}>
                    <Typography variant="subtitle1" style={{ whiteSpace: 'pre-line' }}>
                        <div style={{ fontSize: '13px', paddingBottom: '20px' }}>
                            {t_i18n('Enter one observable per line. Observables must be the same type.')}
                            <br></br>
                            {t_i18n('If you are adding more than 50 entries, please consider using another data import capability for faster processing.')}
                        </div>
                    </Typography>
                    <Field
                        component={TextField}
                        id="bulk_value_field"
                        label={t_i18n('Bulk Content')}
                        variant="outlined"
                        value={localBulkValueField}
                        key="bulk_value_field"
                        name="bulk_value_field"
                        fullWidth={true}
                        multiline={true}
                        rows="5"
                        onChange={(name: any, value: any) => setLocalBulkValueField(value)}
                    />
                    <DialogActions>
                        <Button onClick={localHandleCancelClearBulkModal}>
                            {t_i18n('Cancel')}
                        </Button>
                        <Button color="secondary" onClick={() => handleCloseBulkModal(localBulkValueField)}>
                            {t_i18n('Continue')}
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

export default BulkAddComponent;
