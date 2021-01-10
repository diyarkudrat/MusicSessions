import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import Routes from "./app/navigation/Routes";
import { AuthProvider } from './app/utils/AuthProvider';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({});
