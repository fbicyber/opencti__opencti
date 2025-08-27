import React, { Dispatch, ReactNode, useState } from 'react';

export interface ExportContextType {
  selectedIds: string[]
  setSelectedIds?: Dispatch<string[]>
  selectedColumns: string[]
  setSelectedColumns?: Dispatch<string[]>
}

const defaultContext = {
  selectedIds: [],
  setSelectedIds: () => {},
  selectedColumns: [],
  setSelectedColumns: () => {},
};

export const ExportContext = React.createContext<ExportContextType>(defaultContext);

const ExportContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  return (
    <ExportContext.Provider value={{
      selectedIds,
      setSelectedIds,
      selectedColumns,
      setSelectedColumns,
    }}>
      {children}
    </ExportContext.Provider>
  );
};

export default ExportContextProvider;
