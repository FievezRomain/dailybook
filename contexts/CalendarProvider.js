import React, { createContext, useContext, useState } from 'react';

// Créer le contexte
const CalendarContext = createContext();

// Fournir le contexte
export const CalendarProvider = ({ children }) => {
  const [date, setDate] = useState(null);

  return (
    <CalendarContext.Provider value={{ date, setDate }}>
      {children}
    </CalendarContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useCalendar = () => useContext(CalendarContext);
