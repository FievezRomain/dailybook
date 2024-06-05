import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useState, createContext, useEffect, useContext } from 'react';
import AnimalsService from "../services/AnimalsService";
import EventService from "../services/EventService";
import NoteService from "../services/NoteService";
import ContactService from "../services/ContactService";
import WishService from "../services/WishService";
import ObjectifService from "../services/ObjectifService";
import AuthService from "../services/AuthService";
import { getFirebaseAuth } from '../firebase';

const AuthenticatedUserContext = createContext();

export const AuthenticatedUserProvider =  ({ children }) => {
  const [currentUser, setCurrentUser] = useState(false);
  const [cacheUpdated, setCacheUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const animalService = new AnimalsService();
  const eventService = new EventService();
  const objectifService = new ObjectifService();
  const noteService = new NoteService();
  const contactService = new ContactService();
  const wishService = new WishService();
  const authService = new AuthService;
  const auth = getFirebaseAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
          try {
              await authService.initNotifications();
              setCurrentUser(user);

              if (user.emailVerified) {
                await updateCache(user.email);
                setCacheUpdated(true);
                setEmailVerified(true);
              } else{
                setEmailVerified(false);
              }
          } catch (error) {
              console.error('Erreur :', error);
          }
      } else {
          setCurrentUser(null);
          setCacheUpdated(false);
          setEmailVerified(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateCache = async (email) => {
    try {
        await animalService.refreshCache(email);
        await eventService.refreshCache(email);
        await objectifService.refreshCache(email);
        await noteService.refreshCache(email);
        await contactService.refreshCache(email);
        await wishService.refreshCache(email);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du cache :', error);
    }
  };

  const logout = async () => {
    try {
        await signOut(auth);
        setCurrentUser(null);
        setCacheUpdated(false);
        setEmailVerified(false);
    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <AuthenticatedUserContext.Provider value={{ currentUser, cacheUpdated, loading, emailVerified, logout }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

export const useAuth = () => useContext(AuthenticatedUserContext);