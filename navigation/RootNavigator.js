import React, { useState, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { useAuth } from '../providers/AuthenticatedUserProvider';

export const RootNavigator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser } = useAuth();
  
    // if (isLoading) {
    //   return <LoadingIndicator />;
    // }
  
    return (
      <NavigationContainer>
        {currentUser ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    );
  };