import React, { useState, createContext, useContext } from 'react';

const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

  return (
    <ContactsContext.Provider value={{ contacts, setContacts }}>
      {children}
    </ContactsContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useContacts = () => useContext(ContactsContext);