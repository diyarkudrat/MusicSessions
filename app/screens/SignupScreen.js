import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { Button } from "react-native-ios-kit";
import { IconButton } from "react-native-paper";
import { auth } from "../firebase";

function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createUserWithEmailAndPasswordHandler = async (event) => {
    event.preventDefault();
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
    } catch (err) {
      console.log(err);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register to Create a Group</Text>
      <TextInput
        placeholder="Enter Email"
        labelName="email"
        style={styles.formInput}
        value={email}
        autoCapitalize="none"
        onChangeText={(event) => setEmail(event)}
      />
      <TextInput
        placeholder="Enter Password"
        labelName="password"
        secureTextEntry={true}
        value={password}
        style={styles.formInput}
        onChangeText={(event) => setPassword(event)}
      />
      <Button
        inline
        inverted
        style={styles.button}
        onPress={(event) => {
          createUserWithEmailAndPasswordHandler(event);
        }}
      >
        Sign Up
      </Button>
      <IconButton
        icon="keyboard-backspace"
        size={30}
        style={styles.navButton}
        color="#20E4B5"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2D3F4D",
  },
  button: {
    backgroundColor: "#20E4B5",
    height: 40,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    top: 30,
    borderRadius: 30,
    top: 20,
    marginBottom: 15,
  },
  formInput: {
    width: 300,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  navButton: {
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SignupScreen;
