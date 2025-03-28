import React, { createContext, useState, ReactNode } from 'react';

interface AuditsWeeklyContextType {
  loginCount: number;
  setLoginCount: (count: number) => void;
  weeklyActiveUsersHistory: Array<any>;
  setWeeklyActiveUsersHistory: (history: Array<any>) => void;
}

export const AuditsWeeklyContext = createContext<AuditsWeeklyContextType>({
  loginCount: 0,
  setLoginCount: () => { },
  weeklyActiveUsersHistory: [],
  setWeeklyActiveUsersHistory: () => { },
});

interface AuditsWeeklyProviderProps {
  children: ReactNode;
}

export const AuditsWeeklyProvider: React.FC<AuditsWeeklyProviderProps> = ({ children }) => {
  const [loginCount, setLoginCount] = useState<number>(0);
  const [weeklyActiveUsersHistory, setWeeklyActiveUsersHistory] = useState<Array<any>>(new Array(6));

  return (
    <AuditsWeeklyContext.Provider value={{ loginCount, setLoginCount, weeklyActiveUsersHistory, setWeeklyActiveUsersHistory }}>
      {children}
    </AuditsWeeklyContext.Provider>
  );
};
