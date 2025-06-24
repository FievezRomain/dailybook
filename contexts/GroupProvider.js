import React, { useState, createContext, useContext } from 'react';

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);

  return (
    <GroupContext.Provider value={{ groups, setGroups }}>
      {children}
    </GroupContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useGroups = () => useContext(GroupContext);