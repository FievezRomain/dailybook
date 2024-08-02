import React, { useState, createContext } from 'react';

export const EventsContext = createContext();

export default function EventsProvider ({ children }) {
  const [eventsCache, setEventsCache] = useState({nom: "Sirius"});

  return (
    <EventsContext.Provider value={{ eventsCache, setEventsCache }}>
      {children}
    </EventsContext.Provider>
  );
};