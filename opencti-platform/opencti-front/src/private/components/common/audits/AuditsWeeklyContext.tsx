import React, { createContext, useState, ReactNode } from 'react';

interface AuditsWeeklyContextType {
  loginCount: number;
  setLoginCount: (count: number) => void;
}

export const AuditsWeeklyContext = createContext<AuditsWeeklyContextType>({
  loginCount: 0,
  setLoginCount: () => { },
});

interface AuditsWeeklyProviderProps {
  children: ReactNode;
}

export const AuditsWeeklyProvider: React.FC<AuditsWeeklyProviderProps> = ({ children }) => {
  const [loginCount, setLoginCount] = useState<number>(0);

  return (
    <AuditsWeeklyContext.Provider value={{ loginCount, setLoginCount }}>
      {children}
    </AuditsWeeklyContext.Provider>
  );
};
