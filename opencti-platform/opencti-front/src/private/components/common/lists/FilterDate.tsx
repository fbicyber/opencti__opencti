import React, { FunctionComponent, useState, KeyboardEvent } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { buildDate } from '../../../../utils/Time';

interface FilterDateProps {
  defaultHandleAddFilter: (
    k: string,
    id: string,
    operator?: string,
    event?: React.KeyboardEvent
  ) => void;
  filterKey: string;
  operator?: string;
  inputValues: { key: string, values: string[], operator?: string }[];
  setInputValues: (value: { key: string, values: string[], operator?: string }[]) => void;
  filterLabel: string;
  filterValue?: string;
}

const FilterDate: FunctionComponent<FilterDateProps> = ({
  defaultHandleAddFilter,
  filterKey,
  operator,
  inputValues,
  setInputValues,
  filterLabel,
  filterValue,
}) => {
  const [dateState, setDateState] = useState<Date | null>(filterValue ? new Date(filterValue) : null);

  const findFilterFromKey = (filters: {
    key: string,
    values: (string | Date)[],
    operator?: string
  }[], key: string, op = 'eq') => {
    for (const filter of filters) {
      if (filter.key === key) {
        if (filter.operator === op) {
          return filter;
        }
      }
    }
    return null;
  };

  const handleChangeDate = (date: Date | null) => {
    setDateState(date);
  };

  const handleAcceptDate = (date: Date | null) => {
    if (date && date.toISOString()) {
      // set new input values
      const newInputValue = { key: filterKey, values: [date.toString()], operator };
      const newInputValues = inputValues.filter((f) => f.key !== filterKey || (operator && f.operator !== operator));
      setInputValues([...newInputValues, newInputValue]);
      // add the filter
      defaultHandleAddFilter(filterKey, date.toISOString(), operator);
    }
  };

  const handleValidateDate = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' && dateState) {
      handleAcceptDate(dateState as Date);
    }
  };

  return (
    <DatePicker
      key={filterKey}
      label={filterLabel}
      value={buildDate(dateState || findFilterFromKey(inputValues, filterKey, operator)?.values[0])}
      onChange={(value) => handleChangeDate(value)}
      onAccept={(value) => handleAcceptDate(value)}
      slotProps={{
        textField: (params) => ({
          ...params,
          size: 'small',
          variant: 'outlined',
          fullWidth: true,
          onKeyDown: (event) => handleValidateDate(event),
        }),
      }}
    />
  );
};

export default FilterDate;
