import React, { useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { Add } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { GlobeModel, HexagonOutline } from 'mdi-material-ui';
import { Button } from '@mui/material';
import InvestigationAddStixCoreObjectsLines, { investigationAddStixCoreObjectsLinesQuery } from './InvestigationAddStixCoreObjectsLines';
import StixDomainObjectCreation from '../../common/stix_domain_objects/StixDomainObjectCreation';
import StixCyberObservableCreation from '../../observations/stix_cyber_observables/StixCyberObservableCreation';
import { QueryRenderer } from '../../../../relay/environment';
import { useFormatter } from '../../../../components/i18n';
import useAttributes from '../../../../utils/hooks/useAttributes';
import useAuth from '../../../../utils/hooks/useAuth';
import useHelper from '../../../../utils/hooks/useHelper';
import ListLines from '../../../../components/list_lines/ListLines';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../../utils/filters/filtersUtils';
import Drawer from '../../common/drawer/Drawer';
import { usePaginationLocalStorage } from '../../../../utils/hooks/useLocalStorage';
import { removeEmptyFields } from '../../../../utils/utils';
import { useTheme } from '@mui/styles';

const InvestigationAddStixCoreObjects = (props) => {
  const {
    targetStixCoreObjectTypes,
    workspaceId,
    onAdd,
    onDelete,
    selectedText,
    openDrawer,
    handleClose,
    mapping,
    workspaceStixCoreObjects,
  } = props;
  const { t_i18n } = useFormatter();
  const { stixDomainObjectTypes, stixCyberObservableTypes } = useAttributes();
  const { isFeatureEnable } = useHelper();
  const [open, setOpen] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [openCreateEntity, setOpenCreateEntity] = useState(false);
  const [openCreateObservable, setOpenCreateObservable] = useState(false);
  const isFABReplaced = isFeatureEnable('FAB_REPLACEMENT');

  const theme = useTheme();

  const isTypeDomainObject = (types) => {
    return !types
      || types.some((r) => stixDomainObjectTypes.indexOf(r) >= 0)
      || types.includes('Stix-Domain-Object');
  };
  const isTypeObservable = (types) => {
    return !types
      || types.some((r) => stixCyberObservableTypes.indexOf(r) >= 0)
      || types.includes('Stix-Cyber-Observable');
  };
  const resolveAvailableTypes = () => {
    if (
      targetStixCoreObjectTypes
      && isTypeDomainObject(targetStixCoreObjectTypes)
      && !isTypeObservable(targetStixCoreObjectTypes)
    ) {
      return 'Stix-Domain-Object';
    }
    if (
      targetStixCoreObjectTypes
      && isTypeObservable(targetStixCoreObjectTypes)
      && !isTypeDomainObject(targetStixCoreObjectTypes)
    ) {
      return 'Stix-Cyber-Observable';
    }
    if (
      !targetStixCoreObjectTypes
      || (isTypeObservable(targetStixCoreObjectTypes)
        && isTypeDomainObject(targetStixCoreObjectTypes))
    ) {
      return 'Stix-Core-Object';
    }
    return null;
  };

  const LOCAL_STORAGE_KEY = `investigation-${workspaceId}-add-objects`;
  const { viewStorage, helpers, paginationOptions: addObjectsPaginationOptions } = usePaginationLocalStorage(
    LOCAL_STORAGE_KEY,
    {
      searchTerm: '',
      sortBy: '_score',
      orderAsc: false,
      filters: targetStixCoreObjectTypes
      && !(
        targetStixCoreObjectTypes.includes('Stix-Domain-Object')
        || targetStixCoreObjectTypes.includes('Stix-Cyber-Observable')
      )
        ? {
          mode: 'and',
          filters: [{
            key: 'entity_type',
            values: targetStixCoreObjectTypes,
          }],
          filterGroups: [],
        }
        : emptyFilterGroup,
      types: [resolveAvailableTypes()],
      numberOfElements: {
        number: 0,
        symbol: '',
      },
    },
    true,
  );

  const {
    sortBy,
    orderAsc,
    searchTerm,
    filters,
    numberOfElements,
  } = viewStorage;
  const contextFilters = useBuildEntityTypeBasedFilterContext(targetStixCoreObjectTypes, filters);

  const containerRef = useRef(null);

  const handleOpenCreateEntity = () => {
    setOpenCreateEntity(true);
    setOpenSpeedDial(false);
  };
  const handleCloseCreateEntity = () => {
    setOpenCreateEntity(false);
    setOpenSpeedDial(false);
  };
  const handleOpenCreateObservable = () => {
    setOpenCreateObservable(true);
    setOpenSpeedDial(false);
  };
  const handleCloseCreateObservable = () => {
    setOpenCreateObservable(false);
    setOpenSpeedDial(false);
  };
  const renderDomainObjectCreation = (searchPaginationOptions) => {
    return (
      <StixDomainObjectCreation
        display={open}
        inputValue={keyword}
        paginationKey="Pagination_stixCoreObjects"
        paginationOptions={searchPaginationOptions}
        // confidence={confidence}
        // defaultCreatedBy={defaultCreatedBy}
        // defaultMarkingDefinitions={defaultMarkingDefinitions}
        stixDomainObjectTypes={
            targetStixCoreObjectTypes && targetStixCoreObjectTypes.length > 0
              ? targetStixCoreObjectTypes
              : []
        }
      />
    );
  };
  const renderObservableCreation = (searchPaginationOptions) => {
    return (
      <StixCyberObservableCreation
        display={open}
        contextual={true}
        inputValue={keyword}
        paginationKey="Pagination_stixCoreObjects"
        paginationOptions={searchPaginationOptions}
        // defaultCreatedBy={defaultCreatedBy}
        // defaultMarkingDefinitions={defaultMarkingDefinitions}
      />
    );
  };
  const renderStixCoreObjectCreation = (searchPaginationOptions) => {
    return (
      <>
        <SpeedDial
          style={{position: 'fixed', bottom: 30, right: 30, zIndex: 1100,}}
          ariaLabel="Create"
          icon={<SpeedDialIcon/>}
          onClose={() => setOpenSpeedDial(false)}
          onOpen={() => setOpenSpeedDial(true)}
          open={openSpeedDial}
          FabProps={{
            color: 'secondary',
          }}
        >
          <SpeedDialAction
            title={t_i18n('Create an observable')}
            icon={<HexagonOutline/>}
            tooltipTitle={t_i18n('Create an observable')}
            onClick={() => handleOpenCreateObservable()}
            FabProps={{
              style: {
                backgroundColor: theme.palette.primary.main, 
                color: theme.palette.primary.contrastText, 
                '&:hover': {backgroundColor: theme.palette.primary.main,}
              }
            }}
          />
          <SpeedDialAction
            title={t_i18n('Create an entity')}
            icon={<GlobeModel/>}
            tooltipTitle={t_i18n('Create an entity')}
            onClick={() => handleOpenCreateEntity()}
            FabProps={{
              style: {
                backgroundColor: theme.palette.primary.main, 
                color: theme.palette.primary.contrastText, 
                '&:hover': { backgroundColor: theme.palette.primary.main,}
              }
            }}
          />
        </SpeedDial>
        <StixDomainObjectCreation
          display={open}
          inputValue={keyword}
          paginationKey="Pagination_stixCoreObjects"
          paginationOptions={searchPaginationOptions}
          // confidence={confidence}
          // defaultCreatedBy={defaultCreatedBy}
          // defaultMarkingDefinitions={defaultMarkingDefinitions}
          stixCoreObjectTypes={
              targetStixCoreObjectTypes && targetStixCoreObjectTypes.length > 0
                ? targetStixCoreObjectTypes
                : []
          }
          speeddial={true}
          open={openCreateEntity}
          handleClose={() => handleCloseCreateEntity()}
        />
        <StixCyberObservableCreation
          display={open}
          contextual={true}
          inputValue={keyword}
          paginationKey="Pagination_stixCoreObjects"
          paginationOptions={searchPaginationOptions}
          // defaultCreatedBy={defaultCreatedBy}
          // defaultMarkingDefinitions={defaultMarkingDefinitions}
          speeddial={true}
          open={openCreateObservable}
          handleClose={() => handleCloseCreateObservable()}
        />
      </>
    );
  };
  const renderEntityCreation = (searchPaginationOptions) => {
    if (
      targetStixCoreObjectTypes
            && isTypeDomainObject(targetStixCoreObjectTypes)
            && !isTypeObservable(targetStixCoreObjectTypes)
    ) {
      return renderDomainObjectCreation(searchPaginationOptions);
    }
    if (
      targetStixCoreObjectTypes
            && isTypeObservable(targetStixCoreObjectTypes)
            && !isTypeDomainObject(targetStixCoreObjectTypes)
    ) {
      return renderObservableCreation(searchPaginationOptions);
    }
    if (
      !targetStixCoreObjectTypes
            || (isTypeObservable(targetStixCoreObjectTypes)
                && isTypeDomainObject(targetStixCoreObjectTypes))
    ) {
      return renderStixCoreObjectCreation(searchPaginationOptions);
    }
    return null;
  };

  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();
  const buildColumns = () => {
    return {
      entity_type: {
        label: 'Type',
        width: '15%',
        isSortable: true,
      },
      value: {
        label: 'Value',
        width: '32%',
        isSortable: false,
      },
      createdBy: {
        label: 'Author',
        width: '15%',
        isSortable: isRuntimeFieldEnable(),
      },
      objectLabel: {
        label: 'Labels',
        width: '22%',
        isSortable: false,
      },
      objectMarking: {
        label: 'Marking',
        width: '15%',
        isSortable: isRuntimeFieldEnable(),
      },
    };
  };

  const keyword = mapping && (searchTerm ?? '').length === 0 ? selectedText : searchTerm;
  const searchPaginationOptions = removeEmptyFields({
    ...addObjectsPaginationOptions,
    search: keyword,
    filters: contextFilters,
  });

  return (
    <>
      {!mapping && (
        <Tooltip title={t_i18n('Add an entity to this investigation')}>
          <IconButton
            color="primary"
            aria-label="Add"
            onClick={() => setOpen(true)}
            size="large"
          >
            <Add />
          </IconButton>
        </Tooltip>
      )}
      <Drawer
        open={mapping ? openDrawer : open}
        onClose={() => {
          if (mapping) {
            handleClose();
          } else {
            setOpen(false);
          }
        }}
        title={t_i18n('Add entities')}
        containerRef={containerRef}
      >
        <>
          <ListLines
            helpers={helpers}
            sortBy={sortBy}
            orderAsc={orderAsc}
            dataColumns={buildColumns()}
            handleSearch={helpers.handleSearch}
            keyword={keyword}
            handleSort={helpers.handleSort}
            handleAddFilter={helpers.handleAddFilter}
            handleRemoveFilter={helpers.handleRemoveFilter}
            handleSwitchLocalMode={helpers.handleSwitchLocalMode}
            handleSwitchGlobalMode={helpers.handleSwitchGlobalMode}
            disableCards={true}
            filters={filters}
            paginationOptions={searchPaginationOptions}
            numberOfElements={numberOfElements}
            iconExtension={true}
            parametersWithPadding={true}
            disableExport={true}
            availableEntityTypes={targetStixCoreObjectTypes}
            entityTypes={targetStixCoreObjectTypes}
          >
            <QueryRenderer
              query={investigationAddStixCoreObjectsLinesQuery}
              variables={{ count: 100, ...searchPaginationOptions }}
              render={({ props: renderProps }) => (
                <InvestigationAddStixCoreObjectsLines
                  data={renderProps}
                  workspaceId={workspaceId}
                  paginationOptions={searchPaginationOptions}
                  dataColumns={buildColumns()}
                  initialLoading={renderProps === null}
                  workspaceStixCoreObjects={workspaceStixCoreObjects}
                  onAdd={onAdd}
                  onDelete={onDelete}
                  setNumberOfElements={helpers.handleSetNumberOfElements}
                  mapping={mapping}
                  containerRef={containerRef}
                />
              )}
            />
          </ListLines>
          {renderEntityCreation(searchPaginationOptions)}
        </>
      </Drawer>
    </>
  );
};

export default InvestigationAddStixCoreObjects;
