import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button } from "react-native-ios-kit";
import { AuthContext } from '../navigation/AuthProvider';

function WelcomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [groupCode, setGroupCode] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.title}>MusicSessions</Text>
        <Image style={styles.logo} source={require("../assets/vinyl.png")} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>
          Join or Create a Music Listening Group!
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputStyle}
            placeholder="Enter Group Code"
            placeholderTextColor="#7C7B7B"
            maxLength={6}
            value={groupCode}
            onChangeText={(text) => setGroupCode(text)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.formLabel}>Or</Text>
          <Button
            inline
            inverted
            style={styles.button}
            onPress={() => navigation.navigate("CreateGroup")}
          >
            Create New Group
          </Button>
          <Button
            inline
            inverted
            style={styles.button}
            onPress={() => logout()}
          >
            Logout
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#20E4B5",
    height: 50,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    top: 30,
    borderRadius: 30,
    fontWeight: "bold",
    marginBottom: 15
  },
  buttonContainer: {
    top: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#2D3F4D",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputStyle: {
    width: 300,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#B5B5B5",
    top: 40,
    alignItems: "center",
  },
  logo: {
    top: 30,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    top: 70,
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  formLabel: {
    color: "white",
    fontWeight: "bold",
  },
  title: {
    color: "white",
    fontSize: 36,
    fontWeight: "600",
    bottom: 20,
  },
});

export default WelcomeScreen;