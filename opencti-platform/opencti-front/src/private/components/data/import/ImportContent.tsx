import React, { Component, useState } from 'react';
import * as PropTypes from 'prop-types';
import * as R from 'ramda';
import { createRefetchContainer, graphql } from 'react-relay';
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
import { Field, Form, Formik } from 'formik';
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
import ImportMenu from '../ImportMenu';
import ObjectMarkingField from '../../common/form/ObjectMarkingField';
import SelectField from '../../../../components/fields/SelectField';
import { TEN_SECONDS } from '../../../../utils/Time';
import { fileManagerAskJobImportMutation, scopesConn } from '../../common/files/FileManager';
import FileLine from '../../common/files/FileLine';
import { useFormatter } from '../../../../components/i18n';
import FileUploader from '../../common/files/FileUploader';
import { commitMutation, MESSAGING$ } from '../../../../relay/environment';
import WorkbenchFileLine from '../../common/files/workbench/WorkbenchFileLine';
import FreeTextUploader from '../../common/files/FreeTextUploader';
import WorkbenchFileCreator from '../../common/files/workbench/WorkbenchFileCreator';
import ManageImportConnectorMessage from './ManageImportConnectorMessage';
import { truncate } from '../../../../utils/String';
import { fieldSpacingContainerStyle } from '../../../../utils/field';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { resolveHasUserChoiceParsedCsvMapper } from '../../../../utils/csvMapperUtils';
import useConnectedDocumentModifier from '../../../../utils/hooks/useConnectedDocumentModifier';

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

const ImportContentComponent = () => {
  const interval$ = interval(TEN_SECONDS);
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Import | Data'));
  const classes = useStyles();
  const [sortBy, setSortBy] = useState(null);
  const [filetoImport, setFiletoImport] = useState(null);
  const [filetoValidate, setFiletoValidate] = useState(null);
  const [displayCreate, setDisplayCreate] = useState(false);
  const [orderAsc, setOrderAsc] = useState(false);
  const selectedConnecter = useState(null);
  const hasUserChoiceCsvMapper = useState(false);

  const handleOpenImport = (filetoImport: any) => {
    setFiletoImport(filetoImport);
  }

 const handleCloseImport = () => {
    setFiletoImport(null);
  }

  const handleOpenValidate = (filetoValidate: any) => {
    setFiletoValidate(filetoValidate);
  }

  const handleCloseValidate = () => {
    setFiletoValidate(null);
  }

  const handleOpenCreate = () => {
    setDisplayCreate(true);
  }

  const handleCloseCreate = () => {
    setDisplayCreate(false);
  }

  const importValidation = (configurations: unknown) => {
    const shape = {
      connector_id: Yup.string().required(t_i18n('This field is required')),
    };
    if (configurations) {
      return Yup.object().shape({
        ...shape,
        configuration: Yup.string().required(t_i18n('This field is required')),
      });
    }
    return Yup.object().shape(shape);
  };
  const componentDidMount = () => {
    const subscription = interval$.subscribe(() => {
      relay.refetch();
    });
  };

  componentWillUnmount() {
    subscription.unsubscribe();
  }

  const handleSetCsvMapper = (_: any, csvMapper: string) => {
    const parsedCsvMapper = JSON.parse(csvMapper);
    const parsedRepresentations = JSON.parse(parsedCsvMapper.representations);
    const selectedCsvMapper = {
      ...parsedCsvMapper,
      representations: [...parsedRepresentations],
    };
    { resolveHasUserChoiceParsedCsvMapper(selectedCsvMapper); }
  }



  onSubmitImport(values, { setSubmitting, resetForm }) {
    const { connector_id, configuration, objectMarking } = values;
    let config = configuration;
    // Dynamically inject the markings chosen by the user into the csv mapper.
    const isCsvConnector = this.state.selectedConnector?.name === 'ImportCsv';
    if (isCsvConnector && configuration && objectMarking) {
      const parsedConfig = JSON.parse(configuration);
      if (typeof parsedConfig === 'object') {
        parsedConfig.markings = objectMarking.map((marking) => marking.value);
        config = JSON.stringify(parsedConfig);
      }
    }
    commitMutation({
      mutation: fileManagerAskJobImportMutation,
      variables: {
        fileName: this.state.fileToImport.id,
        connectorId: connector_id,
        configuration: config,
      },
      onCompleted: () => {
        setSubmitting(false);
        resetForm();
        this.handleCloseImport();
        MESSAGING$.notifySuccess(this.props.t('Import successfully asked'));
      },
    });
  }

  onSubmitValidate(values, { setSubmitting, resetForm }) {
    commitMutation({
      mutation: fileManagerAskJobImportMutation,
      variables: {
        fileName: this.state.fileToValidate.id,
        connectorId: values.connector_id,
        bypassValidation: true,
      },
      onCompleted: () => {
        setSubmitting(false);
        resetForm();
        this.handleCloseValidate();
        MESSAGING$.notifySuccess(this.props.t('Import successfully asked'));
      },
    });
  }

  onCreateWorkbenchCompleted() {
    this.props.relay.refetch();
  }

  reverseBy(field) {
    this.setState({ sortBy: field, orderAsc: !this.state.orderAsc });
  }

  SortHeader(field, label, isSortable) {
    const { t } = this.props;
    const sortComponent = this.state.orderAsc ? (
      <ArrowDropDown style={inlineStylesHeaders.iconSort} />
    ) : (
      <ArrowDropUp style={inlineStylesHeaders.iconSort} />
    );
    if (isSortable) {
      return (
        <div
          style={inlineStylesHeaders[field]}
          onClick={this.reverseBy.bind(this, field)}
        >
          <span>{t(label)}</span>
          {this.state.sortBy === field ? sortComponent : ''}
        </div>
      );
    }
    return (
      <div style={inlineStylesHeaders[field]}>
        <span>{t(label)}</span>
      </div>
    );
  }

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

  render() {
    const {
      classes,
      t,
      importFiles,
      pendingFiles,
      nsdt,
      connectorsImport,
      relay,
    } = this.props;
    const { edges: importFilesEdges } = importFiles;
    const { edges: pendingFilesEdges } = pendingFiles;
    const { fileToImport, fileToValidate, displayCreate } = this.state;
    const connectors = connectorsImport.filter((n) => !n.only_contextual); // Can be null but not empty
    const importConnsPerFormat = scopesConn(connectors);
    const handleSelectConnector = (_, value) => {
      const selectedConnector = connectors.find((c) => c.id === value);
      this.setState({ selectedConnector });
    };
    const invalidCsvMapper = this.state.selectedConnector?.name === 'ImportCsv'
      && this.state.selectedConnector?.configurations?.length === 0;
    return (
      <div style={{ paddingRight: 200 }}>
        <Breadcrumbs variant="list" elements={[{ label: t('Data') }, { label: t('Import'), current: true }]} />
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
                {t('Uploaded files')}
              </Typography>
              <div style={{ float: 'left', marginTop: -15 }}>
                <FileUploader
                  onUploadSuccess={() => relay.refetch()}
                  size="medium"
                />
                <FreeTextUploader
                  onUploadSuccess={() => relay.refetch()}
                  size="medium"
                />
              </div>
              <div className="clearfix" />
              <Paper classes={{ root: classes.paper }} className={'paper-for-grid'} variant="outlined">
                {importFilesEdges.length ? (
                  <List>
                    {importFilesEdges.map((file) => file?.node && (
                      <FileLine
                        key={file.node.id}
                        file={file.node}
                        connectors={
                          importConnsPerFormat[file.node.metaData.mimetype]
                        }
                        handleOpenImport={this.handleOpenImport.bind(this)}
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
                      {t('No file for the moment')}
                    </span>
                  </div>
                )}
              </Paper>
            </div>
          </Grid>
          <Grid item xs={4} style={{ paddingTop: 0 }}>
            <Typography variant="h4" gutterBottom={true}>
              {t('Enabled import connectors')}
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
                              ? t('This connector is active')
                              : t('This connector is disconnected')
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
                    {t('No enrichment connectors on this platform')}
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
                {t('Analyst workbenches')}
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
                          {this.SortHeader('name', 'Name', false)}
                          {this.SortHeader('creator_name', 'Creator', false)}
                          {this.SortHeader('labels', 'Labels', false)}
                          {this.SortHeader(
                            'lastModified',
                            'Modification date',
                            false,
                          )}
                        </div>
                      }
                    />
                    <ListItemSecondaryAction style={{ width: 96 }}> &nbsp; </ListItemSecondaryAction>
                  </ListItem>
                  {pendingFilesEdges.map((file) => (
                    <WorkbenchFileLine
                      key={file.node.id}
                      file={file.node}
                      connectors={
                        importConnsPerFormat[file.node.metaData.mimetype]
                      }
                      handleOpenImport={this.handleOpenValidate.bind(this)}
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
            validationSchema={importValidation(t, !!this.state.selectedConnector?.configurations)}
            onSubmit={this.onSubmitImport.bind(this)}
            onReset={this.handleCloseImport.bind(this)}
          >
            {({ submitForm, handleReset, isSubmitting, setFieldValue, isValid }) => (
              <Form style={{ margin: '0 0 20px 0' }}>
                <Dialog
                  open={!!fileToImport}
                  PaperProps={{ elevation: 1 }}
                  keepMounted={true}
                  onClose={() => handleReset()}
                  fullWidth={true}
                >
                  <DialogTitle>{`${t('Launch an import')}`}</DialogTitle>
                  <DialogContent>
                    <Field
                      component={SelectField}
                      variant="standard"
                      name="connector_id"
                      label={t('Connector')}
                      fullWidth={true}
                      containerstyle={{ width: '100%' }}
                      onChange={handleSelectConnector}
                    >
                      {connectors.map((connector) => {
                        const disabled = !fileToImport
                          || (connector.connector_scope.length > 0
                            && !R.includes(
                              fileToImport.metaData.mimetype,
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
                    {this.state.selectedConnector?.configurations?.length > 0
                      ? <Field
                          component={SelectField}
                          variant="standard"
                          name="configuration"
                          label={t('Configuration')}
                          fullWidth={true}
                          containerstyle={{ marginTop: 20, width: '100%' }}
                          onChange={this.handleSetCsvMapper.bind(this)}
                        >
                        {this.state.selectedConnector.configurations?.map((config) => {
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
                      : <ManageImportConnectorMessage name={this.state.selectedConnector?.name }/>
                    }
                    {this.state.selectedConnector?.name === 'ImportCsv'
                      && this.state.hasUserChoiceCsvMapper
                      && (
                        <>
                          <ObjectMarkingField
                            name="objectMarking"
                            style={fieldSpacingContainerStyle}
                            setFieldValue={setFieldValue}
                          />
                        </>
                      )
                    }
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleReset} disabled={isSubmitting}>
                      {t('Cancel')}
                    </Button>
                    <Button
                      color="secondary"
                      onClick={submitForm}
                      disabled={isSubmitting || !isValid || invalidCsvMapper || !this.state.selectedConnector}
                    >
                      {t('Create')}
                    </Button>
                  </DialogActions>
                </Dialog>
              </Form>
            )}
          </Formik>
          <Formik
            enableReinitialize={true}
            initialValues={{ connector_id: '' }}
            validationSchema={importValidation(t)}
            onSubmit={this.onSubmitValidate.bind(this)}
            onReset={this.handleCloseValidate.bind(this)}
          >
            {({ submitForm, handleReset, isSubmitting }) => (
              <Form style={{ margin: '0 0 20px 0' }}>
                <Dialog
                  open={!!fileToValidate}
                  PaperProps={{ elevation: 1 }}
                  keepMounted={true}
                  onClose={this.handleCloseValidate.bind(this)}
                  fullWidth={true}
                >
                  <DialogTitle>{t('Validate and send for import')}</DialogTitle>
                  <DialogContent>
                    <Field
                      component={SelectField}
                      variant="standard"
                      name="connector_id"
                      label={t('Connector')}
                      fullWidth={true}
                      containerstyle={{ width: '100%' }}
                    >
                      {connectors.map((connector, i) => {
                        const disabled = !fileToValidate
                          || (connector.connector_scope.length > 0
                            && !R.includes(
                              fileToValidate.metaData.mimetype,
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
                      {t('Cancel')}
                    </Button>
                    <Button
                      color="secondary"
                      onClick={submitForm}
                      disabled={isSubmitting}
                    >
                      {t('Create')}
                    </Button>
                  </DialogActions>
                </Dialog>
              </Form>
            )}
          </Formik>
          <WorkbenchFileCreator
            handleCloseCreate={this.handleCloseCreate.bind(this)}
            openCreate={displayCreate}
            onCompleted={this.onCreateWorkbenchCompleted.bind(this)}
          />
        </div>
        <Fab
          onClick={this.handleOpenCreate.bind(this)}
          color="primary"
          aria-label="Add"
          className={classes.createButton}
        >
          <Add />
        </Fab>
      </div>
    );
  }
}

ImportContentComponent.propTypes = {
  connectorsImport: PropTypes.array,
  importFiles: PropTypes.object,
  pendingFiles: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  nsdt: PropTypes.func,
};

const ImportContent = createRefetchContainer(
  ImportContentComponent,
  {
    connectorsImport: importConnectorsFragment,
  },
  importContentQuery,
);

export default ImportContent;