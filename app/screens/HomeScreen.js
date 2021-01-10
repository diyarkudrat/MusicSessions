import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { Button } from "react-native-ios-kit";
import { AuthContext } from '../utils/AuthProvider';
import { joinGroupSession } from '../firebase';


function WelcomeScreen({ route, navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [groupCode, setGroupCode] = useState(null);
  const [endSessionMessage, setEndSessionMessage] = useState("");
  const [leaveSessionMessage, setLeaveSessionMessage] = useState("");

  useEffect(() => {
    if (route.params) {
      setEndSessionMessage(route.params.endMessage);
      setLeaveSessionMessage(route.params.leaveMessage);
    }
  })

  const joinSession = async () => {
    const groupSession = await joinGroupSession(groupCode, user.uid);

    navigation.navigate('GroupSession', {
      newGroup: groupSession,
      user: user
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      { endSessionMessage ? Alert.alert(endSessionMessage) : null }
      { leaveSessionMessage ? Alert.alert(leaveSessionMessage) : null }
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
          <Button
            inline
            inverted
            style={styles.joinButton}
            onPress={() => joinSession()}
          >
            Join Group
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.formLabel}>Or</Text>
          <Button
            inline
            inverted
            style={styles.button}
            onPress={() => navigation.navigate("CreateGroup", {
              user: user
            })}
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
    borderRadius: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  joinButton: {
    backgroundColor: "#20E4B5",
    height: 50,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    top: 10,
    borderRadius: 30,
    fontWeight: "bold",
    marginBottom: 15
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
