import React, { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { auth, generateUserDocument } from '../firebase';
import { AuthContext } from './AuthProvider';
import AuthStack from "./AuthStack";
import HomeStack from './HomeStack';

function Routes() {
  const { user, setUser } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  async function onAuthStateChanged(userAuth) {
    const user = await generateUserDocument(userAuth);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    // console.log('Routes.js user', user);
    return subscriber;
  }, []);

  return (
    <NavigationContainer>
      { user ? <HomeStack user={user} /> : <AuthStack /> }
    </NavigationContainer>
  );
}

export default Routes;