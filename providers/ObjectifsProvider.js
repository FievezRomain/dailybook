import React, { useState, createContext, useContext } from 'react';

const ObjectifsContext = createContext();

export const ObjectifsProvider = ({ children }) => {
  const [objectifs, setObjectifs] = useState([]);

  return (
    <ObjectifsContext.Provider value={{ objectifs, setObjectifs }}>
      {children}
    </ObjectifsContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useObjectifs = () => useContext(ObjectifsContext);