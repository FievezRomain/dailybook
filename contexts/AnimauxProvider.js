import React, { useState, createContext, useContext } from 'react';

const AnimauxContext = createContext();

export const AnimauxProvider = ({ children }) => {
  const [animaux, setAnimaux] = useState([]);

  return (
    <AnimauxContext.Provider value={{ animaux, setAnimaux }}>
      {children}
    </AnimauxContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useAnimaux = () => useContext(AnimauxContext);