import React, { useState, createContext } from 'react';

export const AnimauxContext = createContext();

export default function AnimauxProvider ({ children }) {
  const [animauxCache, setAnimauxCache] = useState({nom: "Sirius"});

  return (
    <AnimauxContext.Provider value={{ animauxCache, setAnimauxCache }}>
      {children}
    </AnimauxContext.Provider>
  );
};