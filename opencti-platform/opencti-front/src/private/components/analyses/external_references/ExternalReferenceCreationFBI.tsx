import React, { FunctionComponent, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as R from 'ramda';
import * as Yup from 'yup';
import { graphql } from 'react-relay';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Checkbox from '@mui/material/Checkbox';
import { Add } from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import { RecordSourceSelectorProxy } from 'relay-runtime';
import { FormikConfig } from 'formik/dist/types';
import Drawer, { DrawerControlledDialProps, DrawerVariant } from '@components/common/drawer/Drawer';
import useHelper from 'src/utils/hooks/useHelper';
import useApiMutation from 'src/utils/hooks/useApiMutation';
import { CheckboxWithLabel } from 'formik-mui';
import { handleErrorInForm } from '../../../../relay/environment';
import { useFormatter } from '../../../../components/i18n';
import TextField from '../../../../components/TextField';
import MarkdownField from '../../../../components/fields/MarkdownField';
import { insertNode } from '../../../../utils/store';
import { ExternalReferencesLinesPaginationQuery$variables } from './__generated__/ExternalReferencesLinesPaginationQuery.graphql';
import type { Theme } from '../../../../components/Theme';
import { ExternalReferenceAddInput, ExternalReferenceCreationMutation, ExternalReferenceCreationMutation$data } from './__generated__/ExternalReferenceCreationMutation.graphql';
import CustomFileUploader from '../../common/files/CustomFileUploader';
import CreateEntityControlledDial from '../../../../components/CreateEntityControlledDial';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles<Theme>((theme) => ({
  createButton: {
    position: 'fixed',
    bottom: 30,
    right: 30,
  },
  createButtonContextual: {
    position: 'fixed',
    bottom: 30,
    right: 30,
    zIndex: 3000,
  },
  buttons: {
    marginTop: 20,
    textAlign: 'right',
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}));

export const externalReferenceCreationFBIMutation = graphql`
  mutation ExternalReferenceCreationFBIMutation(
    $input: ExternalReferenceAddInput!
  ) {
    externalReferenceAdd(input: $input) {
      id
      standard_id
      source_name
      description
      url
      external_id
      created
      fileId
    }
  }
`;

const externalReferenceValidation = (t: (value: string) => string) => Yup.object().shape({
  source_selection_is_sentinel: Yup.boolean(),
  source_name: Yup.string().required(t('This field is required')),
  case_file: Yup.string().when(
    'source_selection_is_sentinel',
    ([source_selection_is_sentinel], schema) => (source_selection_is_sentinel
      ? schema.required(t('This field is required'))
      : schema),
  ),
  serial_number: Yup.number()
    .positive()
    .integer()
    .when(
      'source_selection_is_sentinel',
      ([source_selection_is_sentinel], schema) => (source_selection_is_sentinel
        ? schema.required(t('This field is required'))
        : schema),
    ),
  external_id: Yup.string().nullable(),
  url: Yup.string()
    .nullable()
    .matches(
      /^(https?:\/\/[^\s/$.?#].[^\s]*)$/,
      t('The value must be an URL'),
    ),
  description: Yup.string().nullable(),
  file: Yup.mixed().nullable(),
});

interface ExternalReferenceAddInputFBI extends ExternalReferenceAddInput {
  source_selection_is_sentinel?: boolean;
  case_file?: string;
  serial_number?: string;
}

interface ExternalReferenceCreationProps {
  paginationOptions?: ExternalReferencesLinesPaginationQuery$variables;
  display?: boolean;
  contextual?: boolean;
  inputValue?: string;
  onCreate?: (
    externalReference: ExternalReferenceAddInputFBI | null | undefined,
    onlyCreate: boolean
  ) => void;
  openContextual: boolean;
  handleCloseContextual?: () => void;
  creationCallback?: (data: ExternalReferenceCreationMutation$data) => void;
  dryrun?: boolean;
}

const ExternalReferenceCreation: FunctionComponent<
ExternalReferenceCreationProps
> = ({
  contextual,
  paginationOptions,
  display,
  inputValue,
  onCreate,
  handleCloseContextual,
  creationCallback,
  openContextual,
  dryrun,
}) => {
  const classes = useStyles();
  const { t_i18n } = useFormatter();
  const { isFeatureEnable } = useHelper();
  const isFABReplaced = isFeatureEnable('FAB_REPLACEMENT');

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [commit] = useApiMutation<ExternalReferenceCreationMutation>(
    externalReferenceCreationFBIMutation,
    undefined,
    {
      successMessage: `${t_i18n('entity_External-Reference')} ${t_i18n(
        'successfully created',
      )}`,
    },
  );
  const onSubmit: FormikConfig<ExternalReferenceAddInputFBI>['onSubmit'] = (
    values,
    { setSubmitting, setErrors, resetForm },
  ) => {
    const finalValues = values.file.length === 0 ? R.dissoc('file', values) : values;
    // TODO: figure out what to do here!
    // if (finalValues.case_file && finalValues.serial_number) {
    //     finalValues.source_name = finalValues.case_file + finalValues.serialNumber;
    // }
    if (dryrun && onCreate) {
      onCreate(values, true);
      handleClose();
      return;
    }
    commit({
      variables: {
        input: finalValues,
      },
      updater: (store: RecordSourceSelectorProxy) => insertNode(
        store,
        'Pagination_externalReferences',
        paginationOptions,
        'externalReferenceAdd',
      ),
      onError: (error: Error) => {
        handleErrorInForm(error, setErrors);
        setSubmitting(false);
      },
      onCompleted: (response: ExternalReferenceCreationMutation$data) => {
        setSubmitting(false);
        resetForm();
        handleClose();
        if (onCreate) {
          onCreate(response.externalReferenceAdd, true);
        }
      },
      optimisticUpdater: undefined,
      optimisticResponse: undefined,
    });
  };

  const onSubmitContextual: FormikConfig<ExternalReferenceAddInputFBI>['onSubmit'] = (values, { setSubmitting, setErrors, resetForm }) => {
    const finalValues = values.file.length === 0 ? R.dissoc('file', values) : values;
    if (dryrun && creationCallback && handleCloseContextual) {
      creationCallback({
        externalReferenceAdd: values,
      } as ExternalReferenceCreationMutation$data);
      handleCloseContextual();
      return;
    }
    commit({
      variables: {
        input: finalValues,
      },
      onError: (error: Error) => {
        handleErrorInForm(error, setErrors);
        setSubmitting(false);
      },
      onCompleted: (response: ExternalReferenceCreationMutation$data) => {
        setSubmitting(false);
        resetForm();
        if (creationCallback && handleCloseContextual) {
          creationCallback(response);
          handleCloseContextual();
        }
      },
      updater: undefined,
      optimisticUpdater: undefined,
      optimisticResponse: undefined,
    });
  };

  const onResetClassic = () => {
    handleClose();
  };

  const onResetContextual = () => {
    if (handleCloseContextual) {
      handleCloseContextual();
    } else {
      handleClose();
    }
  };

  const isEmbeddedInExternalReferenceCreation = true;
  const CreateExternalReferenceControlledDial = (
    props: DrawerControlledDialProps,
  ) => (
    <CreateEntityControlledDial entityType="External-Reference" {...props} />
  );
  const renderClassic = () => {
    return (
      <Drawer
        title={t_i18n('Create an external reference')}
        variant={isFABReplaced ? undefined : DrawerVariant.create}
        controlledDial={
          isFABReplaced ? CreateExternalReferenceControlledDial : undefined
        }
      >
        {({ onClose }) => (
          <Formik
            initialValues={{
              source_selection_is_sentinel: true,
              case_file: '',
              serial_number: '',
              source_name: '',
              external_id: '',
              url: '',
              description: '',
              file: '',
            }}
            validationSchema={externalReferenceValidation(t_i18n)}
            onSubmit={onSubmit}
            onReset={() => {
              onResetClassic();
              onClose();
            }}
          >
            {({
              values,
              submitForm,
              handleReset,
              isSubmitting,
              setFieldValue,
            }) => (
              <Form style={{ margin: '20px 0 20px 0' }}>
                <div style={{ display: 'inline-block', width: '100%' }}>
                  <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name="source_selection_is_sentinel"
                    Label={{ label: t_i18n('Source selection is Sentinel') }}
                  />
                </div>
                {values.source_selection_is_sentinel && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Field
                      component={TextField}
                      name="case_file"
                      label={t_i18n('Case file')}
                      fullWidth
                    />
                    <div style={{ width: '25px' }} />
                    <Field
                      component={TextField}
                      name="serial_number"
                      label={t_i18n('Serial number')}
                      fullWidth
                    />
                  </div>
                )}
                {!values.source_selection_is_sentinel && (
                  <Field
                    component={TextField}
                    name="source_name"
                    label={t_i18n('Source name')}
                    fullWidth={true}
                  />
                )}
                <Field
                  component={TextField}
                  name="external_id"
                  id={'external_id'}
                  label={t_i18n('External ID')}
                  fullWidth={true}
                  style={{ marginTop: 20 }}
                />
                <Field
                  component={TextField}
                  name="url"
                  label={t_i18n('URL')}
                  fullWidth={true}
                  style={{ marginTop: 20 }}
                />
                {!dryrun && (
                  <CustomFileUploader
                    setFieldValue={setFieldValue}
                    isEmbeddedInExternalReferenceCreation={
                      isEmbeddedInExternalReferenceCreation
                    }
                  />
                )}
                <Field
                  component={MarkdownField}
                  name="description"
                  label={t_i18n('Description')}
                  fullWidth={true}
                  multiline={true}
                  rows="4"
                  style={{ marginTop: 20 }}
                />
                <div className={classes.buttons}>
                  <Button
                    variant="contained"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    classes={{ root: classes.button }}
                  >
                    {t_i18n('Cancel')}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={submitForm}
                    disabled={isSubmitting}
                    classes={{ root: classes.button }}
                  >
                    {t_i18n('Create')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Drawer>
    );
  };

  const renderContextual = () => {
    return (
      <div style={{ display: display ? 'block' : 'none' }}>
        {!handleCloseContextual && !isFABReplaced && (
          <Fab
            onClick={handleOpen}
            color="secondary"
            aria-label="Add"
            className={classes.createButtonContextual}
          >
            <Add />
          </Fab>
        )}
        <Dialog
          PaperProps={{ elevation: 1 }}
          open={isFABReplaced || handleCloseContextual ? openContextual : open}
          onClose={
            isFABReplaced || handleCloseContextual
              ? handleCloseContextual
              : handleClose
          }
        >
          <Formik
            enableReinitialize={true}
            onSubmit={
              !creationCallback && (isFABReplaced || !handleCloseContextual)
                ? onSubmit
                : onSubmitContextual
            }
            initialValues={{
              source_selection_is_sentinel: true,
              source_name: inputValue ?? '',
              external_id: '',
              url: '',
              description: '',
              file: '',
            }}
            validationSchema={externalReferenceValidation(t_i18n)}
            onReset={onResetContextual}
          >
            {({ submitForm, handleReset, isSubmitting, setFieldValue }) => (
              <Form>
                <DialogTitle>
                  {t_i18n('Create an external reference')}
                </DialogTitle>
                <DialogContent>
                  <Field
                    component={Checkbox}
                    name="source_selection_is_sentinel"
                    label={t_i18n('Source selection is Sentinel')}
                    fullWidth={true}
                  />
                  <Field
                    component={TextField}
                    name="source_name"
                    label={t_i18n('Source name')}
                    fullWidth={true}
                  />
                  <Field
                    component={TextField}
                    name="external_id"
                    id={'external_id'}
                    label={t_i18n('External ID')}
                    fullWidth={true}
                    style={{ marginTop: 20 }}
                  />
                  <Field
                    component={TextField}
                    name="url"
                    label={t_i18n('URL')}
                    fullWidth={true}
                    style={{ marginTop: 20 }}
                  />
                  {!dryrun && (
                    <CustomFileUploader
                      setFieldValue={setFieldValue}
                      isEmbeddedInExternalReferenceCreation={
                        isEmbeddedInExternalReferenceCreation
                      }
                    />
                  )}
                  <Field
                    component={MarkdownField}
                    name="description"
                    label={t_i18n('Description')}
                    fullWidth={true}
                    multiline={true}
                    rows="4"
                    style={{ marginTop: 20, marginBottom: 20 }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseContextual || handleReset}
                    disabled={isSubmitting}
                  >
                    {t_i18n('Cancel')}
                  </Button>
                  <Button
                    color="secondary"
                    onClick={submitForm}
                    disabled={isSubmitting}
                  >
                    {t_i18n('Create')}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>
      </div>
    );
  };
  return contextual ? renderContextual() : renderClassic();
};

export default ExternalReferenceCreation;
