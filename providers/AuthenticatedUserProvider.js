import React, { useState, createContext } from 'react';

export const AuthenticatedUserContext = createContext();

export default function AuthenticatedUserProvider ({ children }) {
  const [user, setUser] = useState({email: "test"});

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};