import { FunctionComponent } from 'react';
import BulkAddComponent from '../../../../components/BulkAddComponent';
import React from 'react';


interface StixCyberObservableBulkAddProps {
  genericValueFieldValue: string;
  setBulkValueFieldValue: (value: React.SetStateAction<string>) => void;
  bulkValueFieldValue: string;
  setFieldValue: (name: string, value:any) => void;
  setGenericValueFieldDisabled: (value: React.SetStateAction<boolean>) => void;
  genericValueFieldDisabled: boolean;
  setGenericValueFieldValue: (value: React.SetStateAction<string>) => void;
  bulkAddMsg: string;
}

const StixCyberObservableBulkAdd: FunctionComponent<StixCyberObservableBulkAddProps> = ({
  genericValueFieldValue,
  setBulkValueFieldValue,
  bulkValueFieldValue,
  setFieldValue,
  setGenericValueFieldDisabled,
  genericValueFieldDisabled,
  setGenericValueFieldValue, 
  bulkAddMsg, 
}) => {

  const [openBulkModal, setOpenBulkModal] = React.useState(false);

  const handleOpenBulkModal = () => {
    if (genericValueFieldValue != null && genericValueFieldValue.length > 0 && genericValueFieldValue !== bulkAddMsg) {
      // Trim the field to avoid inserting whitespace as a default population value
      setBulkValueFieldValue(genericValueFieldValue.trim());
    }
    setOpenBulkModal(true);
  };
  const handleCloseBulkModal = (val: string) => {
    setOpenBulkModal(false);
    if (val != null && val.length > 0) {
      setBulkValueFieldValue(val);
      // Clear Attached File marker used by CustomFileUploader interaction to indicate a file need processing
      setFieldValue('file', null);
      // This will disable the file upload button in addition disabling the value box for direct input.
      setGenericValueFieldDisabled(true);
      // Swap value box message to display that TT was used to input multiple values.
      setGenericValueFieldValue(bulkAddMsg);
    } else {
      setBulkValueFieldValue('');
      setGenericValueFieldValue('');
      setGenericValueFieldDisabled(false);
    }
  };
  const localHandleCancelClearBulkModal = () => {
    setOpenBulkModal(false);
    if (!genericValueFieldDisabled) {
      // If one-liner field isn't disabled, then you are it seems deciding
      // not to use the bulk add feature, so we will clear the field, since its population
      // is used to process the bul_value_field versus the generic_value_field
      setBulkValueFieldValue('');
      setGenericValueFieldValue('');
    }
    // else - you previously entered data and you just are canceling out of the popup window
    // but keeping your entry in the form.
  };
  return (
    <BulkAddComponent
      openBulkModal={openBulkModal}
      bulkValueFieldValue={bulkValueFieldValue}
      handleOpenBulkModal={handleOpenBulkModal}
      handleCloseBulkModal={handleCloseBulkModal}
      localHandleCancelClearBulkModal={localHandleCancelClearBulkModal}
    />
  );
}

export default StixCyberObservableBulkAdd
