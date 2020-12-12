import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import NewGroupScreen from "./app/screens/NewGroupScreen";
import GroupScreen from "./app/screens/GroupScreen";

export default function App() {
  // return <WelcomeScreen />;
  // return <NewGroupScreen />;
  return <GroupScreen />;
}

const styles = StyleSheet.create({});
