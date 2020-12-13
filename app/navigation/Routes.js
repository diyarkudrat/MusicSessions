import React, { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { auth } from '../firebase';
import { AuthContext } from './AuthProvider';
import AuthStack from "./AuthStack";
import HomeStack from './HomeStack';

function Routes(props) {
  const { user, setUser } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <NavigationContainer>
      { user ? <HomeStack /> : <AuthStack /> }
    </NavigationContainer>
  );
}

export default Routes;