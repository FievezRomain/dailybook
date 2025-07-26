import React, { useState, createContext, useContext } from 'react';

const WishContext = createContext();

export const WishProvider = ({ children }) => {
  const [wishs, setWishs] = useState([]);

  return (
    <WishContext.Provider value={{ wishs, setWishs }}>
      {children}
    </WishContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useWishs = () => useContext(WishContext);