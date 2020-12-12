import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";

function Routes(props) {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}

export default Routes;
