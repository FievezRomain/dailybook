import React, { useState, createContext, useContext } from 'react';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      {children}
    </NotesContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useNotes = () => useContext(NotesContext);