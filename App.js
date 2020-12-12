import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import Routes from "./app/navigation/Routes";

import WelcomeScreen from "./app/screens/WelcomeScreen";
import NewGroupScreen from "./app/screens/NewGroupScreen";
import GroupScreen from "./app/screens/GroupScreen";
import LoginScreen from "./app/screens/LoginScreen";
import SignupScreen from "./app/screens/SignupScreen";

export default function App() {
  return <Routes />;
}

const styles = StyleSheet.create({});
