import React, { FunctionComponent } from 'react';
import BulkAddDialogComponent from '../../../../components/BulkAddDialogComponent';

interface StixCyberObservableBulkAddDialogProps {
  setBulkValueFieldValue: (value: React.SetStateAction<string>) => void;
  bulkValueFieldValue: string;
  setSelectedAttribute: (value: React.SetStateAction<string>) => void;
  setHashesMD5Value: (value: React.SetStateAction<string>) => void;
  setHashesSHA1Value: (value: React.SetStateAction<string>) => void;
  setHashesSHA256Value: (value: React.SetStateAction<string>) => void;
  setHashesSHA512Value: (value: React.SetStateAction<string>) => void;
  setBulkValueFieldValueDisabled: (value: React.SetStateAction<boolean>) => void;
  setKeyFieldDisabled: (value: React.SetStateAction<boolean>) => void;
  bulkAddMsg: string;
  openBulkAddDialog: boolean;
  setOpenBulkAddDialog: (value: React.SetStateAction<boolean>) => void;
  setFieldValue: (name: string, value:null | string) => void;
  props: any;
}

const StixCyberObservableBulkAddDialog: FunctionComponent<StixCyberObservableBulkAddDialogProps> = ({
  setBulkValueFieldValue,
  bulkValueFieldValue,
  setSelectedAttribute,
  setHashesMD5Value,
  setHashesSHA1Value,
  setHashesSHA256Value,
  setHashesSHA512Value,
  setBulkValueFieldValueDisabled,
  setKeyFieldDisabled,
  bulkAddMsg,
  openBulkAddDialog,
  setOpenBulkAddDialog,
  setFieldValue,
  props,
}) => {
  const handleCloseBulkAddDialog = (val: string) => {
    setOpenBulkAddDialog(false);
    if (val != null && val.length > 0) {
      // START - Clear Attached File from CustomFileUploader
      setBulkValueFieldValue(val);
      // Clear Attached File marker used by CustomFileUploader interaction to indicate a file need processing
      setFieldValue('file', null);
      // This will disable the file upload button in addition disabling the value box for direct input.
      setBulkValueFieldValueDisabled(true);
      // END - Clear Attached File from CustomFileUploader
      setHashesMD5Value(bulkAddMsg);
      setHashesSHA1Value(bulkAddMsg);
      setHashesSHA256Value(bulkAddMsg);
      setHashesSHA512Value(bulkAddMsg);
      setKeyFieldDisabled(true);
    } else {
      setHashesMD5Value('');
      setHashesSHA1Value('');
      setHashesSHA256Value('');
      setHashesSHA512Value('');
      setKeyFieldDisabled(false);
    }
  };
  const handleParentSelectAttribute = (value: string) => {
    setSelectedAttribute(value);
  };
  return (
    <BulkAddDialogComponent
      openBulkAddDialog={openBulkAddDialog}
      bulkValueFieldValue={bulkValueFieldValue}
      handleCloseBulkAddDialog={handleCloseBulkAddDialog}
      handleParentSelectAttribute={handleParentSelectAttribute}
    />
  );
}

export default StixCyberObservableBulkAddDialog;
