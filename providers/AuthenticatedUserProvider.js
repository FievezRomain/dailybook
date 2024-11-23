import { onAuthStateChanged, signOut, updateEmail, updatePassword, updateProfile, getAuth, reload } from 'firebase/auth';
import React, { useState, createContext, useEffect, useContext } from 'react';
import animalsServiceInstance from "../services/AnimalsService";
import eventsServiceInstance from '../services/EventService';
import objectifsServiceInstance from '../services/ObjectifService';
import contactsServiceInstance from '../services/ContactService';
import notesServiceInstance from '../services/NoteService';
import wishsServiceInstance from '../services/WishService';
import { useAnimaux } from './AnimauxProvider';
import { useEvents } from "./EventsProvider";
import { useObjectifs } from "./ObjectifsProvider";
import { useContacts } from "./ContactsProvider";
import { useNotes } from "./NotesProvider";
import { useWishs } from "./WishProvider";
import AuthService from "../services/AuthService";
import { getFirebaseAuth } from '../firebase';
import LoggerService from '../services/LoggerService';
import Toast from "react-native-toast-message";

const AuthenticatedUserContext = createContext();

export const AuthenticatedUserProvider =  ({ children }) => {
  const [currentUser, setCurrentUser] = useState(false);
  const [cacheUpdated, setCacheUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const authService = new AuthService;
  const auth = getFirebaseAuth();
  const { setAnimaux } = useAnimaux();
  const { setEvents } = useEvents();
  const { setObjectifs } = useObjectifs();
  const { setWishs } = useWishs();
  const { setNotes } = useNotes();
  const { setContacts } = useContacts();

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
        animalsServiceInstance.initialize( setAnimaux );
        eventsServiceInstance.initialize( setEvents );
        objectifsServiceInstance.initialize( setObjectifs );
        contactsServiceInstance.initialize( setContacts );
        notesServiceInstance.initialize( setNotes );
        wishsServiceInstance.initialize( setWishs );
        await animalsServiceInstance.refreshCache(email);
        await eventsServiceInstance.refreshCache(email);
        await objectifsServiceInstance.refreshCache(email);
        await notesServiceInstance.refreshCache(email);
        await contactsServiceInstance.refreshCache(email);
        await wishsServiceInstance.refreshCache(email);
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
      // Mise à jour du profil firebase
      await updateProfile(currentUser, {
        photoURL: newPhotoURL
      });
      const updatedUser = await getAuth().currentUser;
      setCurrentUser( {...currentUser, photoURL: newPhotoURL});
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
      //await authService.initTrackingActivity();
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

  const deleteAccount = async (navigation) => {

    if (currentUser) {
      try {
        navigation.navigate("Loading");
        
        // Supprimer le compte de l'utilisateur
        setLoading(true);
        await currentUser.delete();
        setCurrentUser(null);
        setCacheUpdated(false);
        setEmailVerified(false);
        setLoading(false);
        Toast.show({
          position: "top",
          type: "success",
          text1: "Suppression du compte réussie"
        });

        // Rediriger ou effectuer une autre action après suppression
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          Toast.show({
            position: "top",
            type: "info",
            text1: "Reconnexion requise",
            text2: "Vous devez vous reconnecter et refaire la demande"
          });
          await logout();
        } else {
          Toast.show({
            position: "top",
            type: "error",
            text1: "Erreur lors de la suppression du compte",
          });
          LoggerService.log("Erreur lors de la suppression du compte :" + error.message);
          console.error('Erreur :', error);
        }
      }
    }
  }

  return (
    <AuthenticatedUserContext.Provider value={{ currentUser, cacheUpdated, loading, emailVerified, logout, updateDisplayName, updateEmailForUser, updatePasswordForUser, updatePhotoURL, reloadUser, deleteAccount }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

export const useAuth = () => useContext(AuthenticatedUserContext);