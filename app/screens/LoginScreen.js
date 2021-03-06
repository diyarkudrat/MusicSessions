import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { Button } from "react-native-ios-kit";
import { AuthContext } from '../utils/AuthProvider';

function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        placeholder="Enter Email"
        labelName="Email"
        style={styles.formInput}
        value={email}
        autoCapitalize="none"
        onChangeText={(userEmail) => setEmail(userEmail)}
      />
      <TextInput
        placeholder="Enter Password"
        labelName="Password"
        secureTextEntry={true}
        value={password}
        style={styles.formInput}
        onChangeText={(usePassword) => setPassword(usePassword)}
      />
      <Button inline inverted style={styles.button} onPress={() => login(email, password)}>
        Log In
      </Button>
      <Button
        inline
        inverted
        style={styles.button}
        onPress={() => navigation.navigate("Signup")}
      >
        New User? Join here
      </Button>
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
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LoginScreen;
