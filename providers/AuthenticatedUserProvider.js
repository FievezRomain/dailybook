import { onAuthStateChanged, signOut, updateEmail, updatePassword, updateProfile, getAuth, reload } from 'firebase/auth';
import React, { useState, createContext, useEffect, useContext } from 'react';
import AnimalsService from "../services/AnimalsService";
import EventService from "../services/EventService";
import NoteService from "../services/NoteService";
import ContactService from "../services/ContactService";
import WishService from "../services/WishService";
import ObjectifService from "../services/ObjectifService";
import AuthService from "../services/AuthService";
import { getFirebaseAuth } from '../firebase';
import { getImagePath } from '../services/Config';
import LoggerService from '../services/LoggerService';

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
          await reloadUser(user);
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
        LoggerService.log( "Erreur lors de la mise à jour du cache : " + error.message );
        console.error('Erreur lors de la mise à jour du cache :', error);
    }
  };

  const logout = async () => {
    try {
        setLoading(true);
        await signOut(auth);
        setCurrentUser(null);
        setCacheUpdated(false);
        setEmailVerified(false);
        setLoading(false);
    } catch (error) {
        LoggerService.log( "Erreur lors de la déconnexion : " + error.message );
        console.error('Erreur lors de la déconnexion :', error);
    }
  };

  const updateEmailForUser = async (newEmail) => {
    try {
      await updateEmail(currentUser, newEmail);
      const updatedUser = await getAuth().currentUser;
      setCurrentUser( {...currentUser, email: newEmail});
      setCurrentUser(updatedUser);
      console.log("Email updated successfully!");
    } catch (error) {
      LoggerService.log( "Erreur lors de la MAJ de l'email du user sur Firebase : " + error.message );
      console.error("Failed to update email:", error);
      // Handle errors here, such as email already in use
    }
  };

  const updateDisplayName = async (newDisplayName) => {
    try {
      await updateProfile(currentUser, {
        displayName: newDisplayName
      });
      const updatedUser = await getAuth().currentUser;
      setCurrentUser( {...currentUser, displayName: newDisplayName});
      setCurrentUser(updatedUser);
      console.log("Display name updated successfully!");
    } catch (error) {
      LoggerService.log( "Erreur lors de la MAJ du nom du user sur Firebase : " + error.message );
      console.error("Failed to update display name:", error);
      // Handle errors here
    }
  };

  const updatePasswordForUser = async (newPassword) => {
    try {
      await updatePassword(currentUser, newPassword);
      console.log("Password updated successfully!");
    } catch (error) {
      LoggerService.log( "Erreur lors de la MAJ du password du user sur Firebase : " + error.message );
      console.error("Failed to update password:", error);
      // Handle errors here, such as weak password
    }
  };

  const updatePhotoURL = async (newPhotoURL) => {
    try {
      await updateProfile(currentUser, {
        photoURL: getImagePath() + newPhotoURL + ".jpg"
      });
      const updatedUser = await getAuth().currentUser;
      setCurrentUser( {...currentUser, photoURL: getImagePath() + newPhotoURL + ".jpg"});
      setCurrentUser(updatedUser);
      console.log("Photo URL updated successfully!");
    } catch (error) {
      LoggerService.log( "Erreur lors de la MAJ de la photo URL du user sur Firebase : " + error.message );
      console.error("Failed to update photo URL:", error);
    }
  };

  const reloadUser = async (user) => {
    try {
      const tempUser = user;
      await reload(tempUser);
      await authService.initNotifications();
      // Récupération de l'image de profil
      /* var result = await authService.getUser(user.email);
      if(result.filename != undefined){
        user.photoURL = getImagePath() + result.filename;
      } */
      setCurrentUser(tempUser);
      if (tempUser.emailVerified) {
        await updateCache(tempUser.email);
        setCacheUpdated(true);
        setEmailVerified(true);
      } else{
        setEmailVerified(false);
      }
    } catch (error) {
        LoggerService.log( "Erreur lors du rechargement des informations du user sur Firebase : " + error.message );
        console.error('Erreur :', error);
    }
  };

  return (
    <AuthenticatedUserContext.Provider value={{ currentUser, cacheUpdated, loading, emailVerified, logout, updateDisplayName, updateEmailForUser, updatePasswordForUser, updatePhotoURL, reloadUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

export const useAuth = () => useContext(AuthenticatedUserContext);