import React, { useState, createContext, useContext } from 'react';

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useEvents = () => useContext(EventsContext);