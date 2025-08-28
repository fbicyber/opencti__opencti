import React, { Dispatch, ReactNode, useState } from 'react';

export interface ExportContextType {
  selectedIds: string[]
  setSelectedIds?: Dispatch<string[]>
  availableColumns: string[],
  setAvailableColumns?: Dispatch<string[]>,
  selectedColumns: string[]
  setSelectedColumns?: Dispatch<string[]>
}

const defaultContext = {
  selectedIds: [],
  setSelectedIds: () => {},
  availableColumns: [],
  setAvailableColumns: () => {},
  selectedColumns: [],
  setSelectedColumns: () => {},
};

export const ExportContext = React.createContext<ExportContextType>(defaultContext);

const ExportContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  return (
    <ExportContext.Provider
      value={{
        selectedIds,
        setSelectedIds,
        availableColumns,
        setAvailableColumns,
        selectedColumns,
        setSelectedColumns,
      }}
    >
      {children}
    </ExportContext.Provider>
  );
};

export default ExportContextProvider;
