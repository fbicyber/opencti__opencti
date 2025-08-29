import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import React, { Dispatch, useContext, useEffect, useState } from 'react';
import { useTheme } from '@mui/styles';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { DragIndicatorOutlined } from '@mui/icons-material';
import type { Theme } from '../../Theme';
import { useFormatter } from '../../i18n';
import { ExportContext } from '../../../utils/ExportContextProvider';

interface SelectColumnsDialogProps {
  open: boolean,
  handleClose: () => void,
}

const AvailableColumns = ({
  availableColumns,
  selectedColumns,
  setSelectedColumns = () => {},
}: {
  availableColumns: string[],
  selectedColumns: string[],
  setSelectedColumns?: Dispatch<string[]>,
}) => {
  const theme = useTheme<Theme>();
  const { t_i18n } = useFormatter();

  return (
    <Grid2 size={{ xs: 6 }}>
      <Typography
        variant="h4" gutterBottom={true}
      >
        {t_i18n('Available Columns')}
      </Typography>
      <Paper
        variant="outlined"
        className='paper-for-grid'
        style={{
          marginTop: theme.spacing(1),
          padding: 20,
          borderRadius: 4,
        }}
      >
        {availableColumns.map((colName) => (
          <FormControlLabel
            key={colName}
            control={<Checkbox />}
            label={t_i18n(colName)}
            checked={selectedColumns.includes(colName)}
            sx={{ width: '100%' }}
            onChange={() => {
              if (selectedColumns.includes(colName)) {
                setSelectedColumns(selectedColumns.filter((col) => col !== colName));
              } else {
                setSelectedColumns([colName, ...selectedColumns]);
              }
            }}
          />
        ))}
      </Paper>
    </Grid2>
  );
};

const SelectedColumns = ({
  selectedColumns,
}: {
  selectedColumns: string[],
}) => {
  const theme = useTheme<Theme>();
  const { t_i18n } = useFormatter();
  return (
    <Grid2 size={{ xs: 6 }}>
      <Typography
        variant="h4" gutterBottom={true}
      >
        {t_i18n('Selected Columns')}
      </Typography>
      <Paper
        variant="outlined"
        className='paper-for-grid'
        style={{
          marginTop: theme.spacing(1),
          padding: 20,
          borderRadius: 4,
        }}
      >
        <Table size='small'>
          {/*
          TODO: Flush out draggable context, if that is so desired.
          Top-most column name would be the first (left-most) column in the
          output CSV, followed by each subsequent line.
           */}
          <DragDropContext onDragEnd={() => {}}>
            <Droppable droppableId='selected_columns'>
              {() => (
                <TableBody>
                  {selectedColumns.map((colName, index) => (
                    <Draggable key={colName} draggableId={`${colName}_order`} index={index}>
                      {() => (
                        <TableRow>
                          <TableCell
                            component={'th'}
                            scope={'row'}
                            style={{
                              verticalAlign: 'bottom',
                            }}
                          >
                            <DragIndicatorOutlined />
                          </TableCell>
                          <TableCell>
                            {colName}
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </Paper>
    </Grid2>
  );
};

const SelectColumnsDialog: React.FunctionComponent<
SelectColumnsDialogProps
> = ({
  open,
  handleClose,
}) => {
  const { t_i18n } = useFormatter();
  const {
    availableColumns,
    selectedColumns,
    setSelectedColumns,
  } = useContext(ExportContext);

  const [prevSelection, setPrevSelection] = useState<string[]>(selectedColumns);
  useEffect(() => {
    setPrevSelection(selectedColumns);
  }, [selectedColumns]);

  const handleReset = () => {
    if (setSelectedColumns) {
      setSelectedColumns(prevSelection);
    }
  };
  const handleCancel = () => {
    handleReset();
    handleClose();
  };
  const handleSave = () => {
    setPrevSelection(selectedColumns);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>
        {t_i18n('Select columns')}
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={3}>
          <AvailableColumns
            availableColumns={availableColumns}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
          />
          <SelectedColumns selectedColumns={selectedColumns} />
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleReset}
          variant="contained"
        >
          {t_i18n('Reset')}
        </Button>
        <Button
          onClick={handleCancel}
          color="error"
          variant="contained"
        >
          {t_i18n('Cancel')}
        </Button>
        <Button
          onClick={handleSave}
          color="secondary"
          variant="contained"
        >
          {t_i18n('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectColumnsDialog;
