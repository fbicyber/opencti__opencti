import React, { FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import * as R from 'ramda';
import { createRefetchContainer, graphql, RelayRefetchProp } from 'react-relay';
import { interval } from 'rxjs';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { Add, ArrowDropDown, ArrowDropUp, Extension } from '@mui/icons-material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { Field, Form, Formik, FormikConfig } from 'formik';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem';
import DialogActions from '@mui/material/DialogActions';
import { ListItemButton } from '@mui/material';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import Fab from '@mui/material/Fab';
import makeStyles from '@mui/styles/makeStyles';
import { FileLine_file$data } from '@components/common/files/__generated__/FileLine_file.graphql';
import { FileManagerAskJobImportMutation$variables } from '@components/common/files/__generated__/FileManagerAskJobImportMutation.graphql';
import ImportMenu from '../ImportMenu';
import ObjectMarkingField from '../../common/form/ObjectMarkingField';
import SelectField from '../../../../components/fields/SelectField';
import { TEN_SECONDS } from '../../../../utils/Time';
import { fileManagerAskJobImportMutation, scopesConn } from '../../common/files/FileManager';
import FileLine from '../../common/files/FileLine';
import { useFormatter } from '../../../../components/i18n';
import FileUploader from '../../common/files/FileUploader';
import { commitMutation, defaultCommitMutation, MESSAGING$ } from '../../../../relay/environment';
import WorkbenchFileLine from '../../common/files/workbench/WorkbenchFileLine';
import FreeTextUploader from '../../common/files/FreeTextUploader';
import WorkbenchFileCreator from '../../common/files/workbench/WorkbenchFileCreator';
import ManageImportConnectorMessage from './ManageImportConnectorMessage';
import { truncate } from '../../../../utils/String';
import { fieldSpacingContainerStyle } from '../../../../utils/field';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { resolveHasUserChoiceParsedCsvMapper } from '../../../../utils/csvMapperUtils';
import useConnectedDocumentModifier from '../../../../utils/hooks/useConnectedDocumentModifier';
import { ImportContentQuery$data } from './__generated__/ImportContentQuery.graphql';

const interval$ = interval(TEN_SECONDS);

const useStyles = makeStyles(() => ({
  gridContainer: {
    marginBottom: 20,
  },
  paper: {
    padding: '10px 15px 10px 15px',
    borderRadius: 4,
    marginTop: 2,
  },
  item: {
    paddingLeft: 10,
    height: 50,
  },
  itemHead: {
    paddingLeft: 10,
    textTransform: 'uppercase',
  },
  createButton: {
    position: 'fixed',
    bottom: 30,
    right: 230,
  },
}));

const inlineStylesHeaders = {
  iconSort: {
    position: 'absolute',
    margin: '0 0 0 5px',
    padding: 0,
    top: '0px',
  },
  name: {
    float: 'left',
    width: '35%',
    fontSize: 12,
    fontWeight: '700',
  },
  creator_name: {
    float: 'left',
    width: '20%',
    fontSize: 12,
    fontWeight: '700',
  },
  labels: {
    float: 'left',
    width: '20%',
    fontSize: 12,
    fontWeight: '700',
  },
  lastModified: {
    float: 'left',
    width: '20%',
    fontSize: 12,
    fontWeight: '700',
  },
};

interface ConnectorConfiguration {
  configuration: string;
  id: string;
  name: string
}

interface Connector {
  id: string;
  name: string;
  active: boolean;
  only_contextual: boolean;
  connector_scope: string[];
  updated_at: string;
  configurations: ConnectorConfiguration[];
}

const importValidation = (t: (value: string) => string, configurations: boolean) => {
  const shape = {
    connector_id: Yup.string().required(t('This field is required')),
  };
  if (configurations) {
    return Yup.object().shape({
      ...shape,
      configuration: Yup.string().required(t('This field is required')),
    });
  }
  return Yup.object().shape(shape);
};

interface ImportContentBaseProps {
  importContent: ImportContentQuery$data;
  connectors: Record<
  string,
  {
    id: string,
    name: string;
    active: boolean;
    connector_scope: string[];
    updated_at: string;
  }
  >;
  relay: RelayRefetchProp;
  connectorsImport: Connector[];
}
const ImportContentComponent: FunctionComponent<
ImportContentBaseProps
> = ({ importContent, relay, connectorsImport }) => {
  const classes = useStyles();
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Import | Data'));
  const [selectedConnector, setSelectedConnector] = useState<Connector>();
  const { importFiles, pendingFiles } = importContent;
  const [sortBy, setSortBy] = useState();
  const [filetoImport, setFiletoImport] = useState<FileLine_file$data | null | undefined>();
  const [filetoValidate, setFiletoValidate] = useState<FileLine_file$data | null | undefined>();
  const [displayCreate, setDisplayCreate] = useState(false);
  const [orderAsc, setOrderAsc] = useState(false);
  const hasUserChoiceCsvMapper = useState(false);

  const handleOpenImport = (file: FileLine_file$data | null | undefined) => {
    return setFiletoImport(file);
  };

  const handleCloseImport = () => {
    return setFiletoImport(null);
  };

  const handleOpenValidate = (file: FileLine_file$data | null | undefined) => {
    return setFiletoValidate(file);
  };

  const handleCloseValidate = () => {
    return setFiletoValidate(null);
  };

  const handleOpenCreate = () => {
    return setDisplayCreate(true);
  };

  const handleCloseCreate = () => {
    return setDisplayCreate(false);
  };

  // const { edges: importFilesEdges } = importFiles;
  // const { edges: pendingFilesEdges } = pendingFiles;
  const onSubmitImport: FormikConfig<{ connector_id: string, configuration: string, objectMarking: [] }>['onSubmit'] = (
    values,
    { setSubmitting, resetForm },
  ) => {
    const variables: FileManagerAskJobImportMutation$variables = {
      fileName: filetoImport?.id ?? '',
      connectorId: values.connector_id,
    };
    if (selectedConnector?.name === 'ImportCsv') {
      const markings = values.objectMarking.map((option: { value: string; }) => option.value);
      const parsedConfig = JSON.parse(values.configuration);
      if (typeof parsedConfig === 'object') {
        parsedConfig.markings = [...markings];
        variables.configuration = JSON.stringify(parsedConfig);
      }
    }

    commitMutation({
      mutation: fileManagerAskJobImportMutation,
      variables,
      onCompleted: () => {
        setSubmitting(false);
        resetForm();
        handleCloseImport();
        MESSAGING$.notifySuccess('Import successfully asked');
      },
      updater: undefined,
      optimisticUpdater: undefined,
      optimisticResponse: undefined,
      onError: undefined,
      setSubmitting: undefined,
    });
  };
  useEffect(() => {
    // Refresh the export viewer every interval
    const subscription = interval$.subscribe(() => {
      if (relay.refetch) {
        relay.refetch({ importFiles, pendingFiles });
      }
    });
    return function cleanup() {
      subscription.unsubscribe();
    };
  }, []);
  const connectors = connectorsImport.filter((n) => !n.only_contextual); // Can be null but not empty
  const importConnsPerFormat = scopesConn(connectors);
  const handleSelectConnector = (_: string, value: string) => {
    setSelectedConnector(connectors?.find((c) => c.id === value));
  };
  const invalidCsvMapper = selectedConnector?.name === 'ImportCsv'
        && selectedConnector?.configurations?.length === 0;

  const handleSetCsvMapper = (_: string, csvMapper: string) => {
    const parsedCsvMapper = JSON.parse(csvMapper);
    const parsedRepresentations = JSON.parse(parsedCsvMapper.representations);
    const selectedCsvMapper = {
      ...parsedCsvMapper,
      representations: [...parsedRepresentations],
    };
    return resolveHasUserChoiceParsedCsvMapper(selectedCsvMapper);
  };

  const onSubmitValidate = (values: { connector_id: string }, { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void }) => {
    commitMutation({
      ...defaultCommitMutation,
      mutation: fileManagerAskJobImportMutation,
      variables: {
        fileName: filetoImport,
        connectorId: values.connector_id,
        bypassValidation: true,
      },
      onCompleted: () => {
        setSubmitting(false);
        resetForm();
        handleCloseImport();
        MESSAGING$.notifySuccess(t_i18n('Import successfully asked'));
      },
    });
  };

  const onCreateWorkbenchCompleted = () => {
    relay.refetch({});
  };

  const reverseBy = (field: React.SetStateAction<undefined>) => {
    return (
      setSortBy(field),
      setOrderAsc(!orderAsc)
    );
  };

  const SortHeader = (field: SetStateAction<undefined>, label: string, isSortable: boolean) => {
    const sortComponent = orderAsc ? (
      <ArrowDropDown style={inlineStylesHeaders.iconSort} />
    ) : (
      <ArrowDropUp style={inlineStylesHeaders.iconSort} />
    );
    if (isSortable) {
      return (
        <div
          style={inlineStylesHeaders[field]}
          onClick={() => reverseBy(field)}
        >
          <span>{t_i18n(label)}</span>
          {sortBy(field) ? sortComponent : ''}
        </div>
      );
    }
    return (
      <div style={inlineStylesHeaders[field]}>
        <span>{t_i18n(label)}</span>
      </div>
    );
  };
  return (
    <div style={{ paddingRight: 200 }}>
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Data') }, { label: t_i18n('Import'), current: true }]} />
      <ImportMenu />
      <Grid
        container={true}
        spacing={3}
        classes={{ container: classes.gridContainer }}
        style={{ marginTop: 0 }}
      >
        <Grid item xs={8} style={{ paddingTop: 0 }}>
          <div style={{ height: '100%' }} className="break">
            <Typography
              variant="h4"
              gutterBottom={true}
              style={{ float: 'left' }}
            >
              {t_i18n('Uploaded files')}
            </Typography>
            <div style={{ float: 'left', marginTop: -15 }}>
              <FileUploader
                onUploadSuccess={() => relay.refetch({})}
                size="medium" entityId={''}
              />
              <FreeTextUploader
                onUploadSuccess={() => relay.refetch({})}
                size="medium"
              />
            </div>
            <div className="clearfix" />
            <Paper classes={{ root: classes.paper }} className={'paper-for-grid'} variant="outlined">
              {importFiles?.edges?.length ? (
                <List>
                  {importFiles.map((file: FileLine_file$data | null | undefined) => file?.node && (
                    <FileLine
                      key={file.node.id}
                      file={file.node}
                      connectors={importConnsPerFormat[file.node.metaData.mimetype]}
                      handleOpenImport={handleOpenImport} dense={false}
                    />
                  ))}
                </List>
              ) : (
                <div
                  style={{ display: 'table', height: '100%', width: '100%' }}
                >
                  <span
                    style={{
                      display: 'table-cell',
                      verticalAlign: 'middle',
                      textAlign: 'center',
                    }}
                  >
                    {t_i18n('No file for the moment')}
                  </span>
                </div>
              )}
            </Paper>
          </div>
        </Grid>
        <Grid item xs={4} style={{ paddingTop: 0 }}>
          <Typography variant="h4" gutterBottom={true}>
            {t_i18n('Enabled import connectors')}
          </Typography>
          <Paper
            classes={{ root: classes.paper }}
            variant="outlined"
            style={{ marginTop: 12 }}
            className={'paper-for-grid'}
          >
            {connectors.length ? (
              <List>
                {connectors.map((connector) => {
                  const connectorScope = connector.connector_scope.join(',');
                  return (
                    <ListItemButton
                      component={Link}
                      to={`/dashboard/data/ingestion/connectors/${connector.id}`}
                      key={connector.id}
                      dense={true}
                      divider={true}
                      classes={{ root: classes.item }}
                    >
                      <Tooltip
                        title={
                              connector.active
                                ? t_i18n('This connector is active')
                                : t_i18n('This connector is disconnected')
                            }
                      >
                        <ListItemIcon
                          style={{
                            color: connector.active ? '#4caf50' : '#f44336',
                          }}
                        >
                          <Extension/>
                        </ListItemIcon>
                      </Tooltip>
                      <Tooltip title={connectorScope}>
                        <ListItemText
                          primary={connector.name}
                          secondary={truncate(connectorScope, 30)}
                        />
                      </Tooltip>
                      {connector.updated_at && (<ListItemSecondaryAction>
                        <ListItemText primary={nsdt(connector.updated_at)}/>
                      </ListItemSecondaryAction>)}
                    </ListItemButton>
                  );
                })}
              </List>
            ) : (
              <div
                style={{ display: 'table', height: '100%', width: '100%' }}
              >
                <span
                  style={{
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                  }}
                >
                  {t_i18n('No enrichment connectors on this platform')}
                </span>
              </div>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <div style={{ height: '100%' }} className="break">
            <Typography
              variant="h4"
              gutterBottom={true}
              style={{ marginBottom: 15 }}
            >
              {t_i18n('Analyst workbenches')}
            </Typography>
            <Paper classes={{ root: classes.paper }} variant="outlined">
              <List>
                <ListItem
                  classes={{ root: classes.itemHead }}
                  divider={false}
                  style={{ paddingTop: 0 }}
                >
                  <ListItemIcon>
                    <span
                      style={{
                        padding: '0 8px 0 8px',
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                          &nbsp;
                    </span>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <div>
                        {SortHeader('name', 'Name', false)}
                        {SortHeader('creator_name', 'Creator', false)}
                        {SortHeader('labels', 'Labels', false)}
                        {SortHeader(
                          'lastModified',
                          'Modification date',
                          false,
                        )}
                      </div>
                        }
                  />
                  <ListItemSecondaryAction style={{ width: 96 }}> &nbsp; </ListItemSecondaryAction>
                </ListItem>
                {pendingFiles?.edges?.map((file) => (
                  <WorkbenchFileLine
                    key={file.node.id}
                    file={file.node}
                    connectors={
                          importConnsPerFormat[file?.node?.metaData?.mimetype]
                        }
                    handleOpenImport={handleOpenValidate}
                  />
                ))}
              </List>
            </Paper>
          </div>
        </Grid>
      </Grid>
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{ connector_id: '', configuration: '', objectMarking: [] }}
          validationSchema={importValidation(t_i18n, !!selectedConnector?.configurations)}
          onSubmit={onSubmitImport}
          onReset={handleCloseImport}
        >
          {({ submitForm, handleReset, isSubmitting, setFieldValue, isValid }) => (
            <Form style={{ margin: '0 0 20px 0' }}>
              <Dialog
                open={!!filetoImport}
                PaperProps={{ elevation: 1 }}
                keepMounted={true}
                onClose={() => handleReset()}
                fullWidth={true}
              >
                <DialogTitle>{`${t_i18n('Launch an import')}`}</DialogTitle>
                <DialogContent>
                  <Field
                    component={SelectField}
                    variant="standard"
                    name="connector_id"
                    label={t_i18n('Connector')}
                    fullWidth={true}
                    containerstyle={{ width: '100%' }}
                    onChange={handleSelectConnector}
                  >
                    {connectors.map((connector) => {
                      const disabled = !filetoImport
                            || (connector.connector_scope.length > 0
                              && !R.includes(
                                filetoImport?.metaData?.mimetype,
                                connector.connector_scope,
                              ));
                      return (
                        <MenuItem
                          key={connector.id}
                          value={connector.id}
                          disabled={disabled || !connector.active}
                        >
                          {connector.name}
                        </MenuItem>
                      );
                    })}
                  </Field>
                  {(selectedConnector?.configurations?.length ?? 0) > 0
                    ? <Field
                        component={SelectField}
                        variant="standard"
                        name="configuration"
                        label={t_i18n('Configuration')}
                        fullWidth={true}
                        containerstyle={{ marginTop: 20, width: '100%' }}
                        onChange={handleSetCsvMapper}
                      >
                      {selectedConnector?.configurations?.map((config) => {
                        return (
                          <MenuItem
                            key={config.id}
                            value={config.configuration}
                          >
                            {config.name}
                          </MenuItem>
                        );
                      })}
                    </Field>
                    : <ManageImportConnectorMessage name={selectedConnector?.name }/>
                      }
                  {selectedConnector?.name === 'ImportCsv'
                        && hasUserChoiceCsvMapper
                        && (
                          <ObjectMarkingField
                            name="objectMarking"
                            style={fieldSpacingContainerStyle}
                            setFieldValue={setFieldValue}
                          />
                        )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleReset} disabled={isSubmitting}>
                    {t_i18n('Cancel')}
                  </Button>
                  <Button
                    color="secondary"
                    onClick={submitForm}
                    disabled={isSubmitting || !isValid || invalidCsvMapper || !selectedConnector}
                  >
                    {t_i18n('Create')}
                  </Button>
                </DialogActions>
              </Dialog>
            </Form>
          )}
        </Formik>
        <Formik
          enableReinitialize={true}
          initialValues={{ connector_id: '' }}
          validationSchema={importValidation(t_i18n, (selectedConnector?.configurations.length ?? 0) > 0)}
          onSubmit={onSubmitValidate}
          onReset={handleCloseValidate}
        >
          {({ submitForm, handleReset, isSubmitting }) => (
            <Form style={{ margin: '0 0 20px 0' }}>
              <Dialog
                open={!!filetoValidate}
                PaperProps={{ elevation: 1 }}
                keepMounted={true}
                onClose={handleCloseValidate}
                fullWidth={true}
              >
                <DialogTitle>{t_i18n('Validate and send for import')}</DialogTitle>
                <DialogContent>
                  <Field
                    component={SelectField}
                    variant="standard"
                    name="connector_id"
                    label={t_i18n('Connector')}
                    fullWidth={true}
                    containerstyle={{ width: '100%' }}
                  >
                    {connectors.map((connector, i) => {
                      const disabled = !filetoValidate
                            || (connector.connector_scope.length > 0
                              && !R.includes(
                                filetoValidate?.metaData?.mimetype,
                                connector.connector_scope,
                              ));
                      return (
                        <MenuItem
                          key={i}
                          value={connector.id}
                          disabled={disabled || !connector.active}
                        >
                          {connector.name}
                        </MenuItem>
                      );
                    })}
                  </Field>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleReset} disabled={isSubmitting}>
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
              </Dialog>
            </Form>
          )}
        </Formik>
        <WorkbenchFileCreator
          handleCloseCreate={handleCloseCreate}
          openCreate={displayCreate}
          onCompleted={onCreateWorkbenchCompleted}
        />
      </div>
      <Fab
        onClick={handleOpenCreate}
        color="primary"
        aria-label="Add"
        className={classes.createButton}
      >
        <Add />
      </Fab>
    </div>
  );
};

const importConnectorsFragment = graphql`
  fragment ImportContentContainer_connectorsImport on Connector
  @relay(plural: true) {
    id
    name
    active
    only_contextual
    connector_scope
    updated_at
    configurations {
      id
      name,
      configuration
    }
  }
`;

export const importContentQuery = graphql`
  query ImportContentQuery {
    connectorsForImport {
      ...ImportContentContainer_connectorsImport
    }
    importFiles(first: 100) @connection(key: "Pagination_global_importFiles") {
      edges {
        node {
          id
          ...FileLine_file
          metaData {
            mimetype
          }
        }
      }
    }
    pendingFiles(first: 100)
    @connection(key: "Pagination_global_pendingFiles") {
      edges {
        node {
          id
          ...ImportWorkbenchesContentFileLine_file
          metaData {
            mimetype
          }
        }
      }
    }
  }
`;

/* ImportContentComponent.propTypes = {
  connectorsImport: PropTypes.array,
  importFiles: PropTypes.object,
  pendingFiles: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  nsdt: PropTypes.func,
}; */

const ImportContent = createRefetchContainer(
  ImportContentComponent,
  {
    connectorsImport: importConnectorsFragment,
  },
  importContentQuery,
);

export default ImportContent;
