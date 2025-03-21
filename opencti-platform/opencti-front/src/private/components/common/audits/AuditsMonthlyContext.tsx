import React, { createContext, useState, ReactNode } from 'react';

interface AuditsMonthlyContextType {
  loginCount: number;
  setLoginCount: (count: number) => void;
}

export const AuditsMonthlyContext = createContext<AuditsMonthlyContextType>({
  loginCount: 0,
  setLoginCount: () => { },
});

interface AuditsMonthlyProviderProps {
  children: ReactNode;
}

export const AuditsMonthlyProvider: React.FC<AuditsMonthlyProviderProps> = ({ children }) => {
  const [loginCount, setLoginCount] = useState<number>(0);

  return (
    <AuditsMonthlyContext.Provider value={{ loginCount, setLoginCount }}>
      {children}
    </AuditsMonthlyContext.Provider>
  );
};
