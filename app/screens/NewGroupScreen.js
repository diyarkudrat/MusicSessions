import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-ios-kit";
import { IconButton } from "react-native-paper";
import { createNewGroup, getGroupSession } from '../firebase';

function NewGroupScreen({ route, navigation }) {
  const [name, setName] = useState('');
  const { user } = route.params;

  const handleButtonPress = async () => {
    if (name.length > 0) {
      const newGroup = await createNewGroup(name, user);
      navigation.navigate('GroupSession', {
        newGroup: newGroup,
        user: user
      });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>Create a New Group</Text>
        <View>
          <TextInput
            placeholder="Enter Group Name"
            style={styles.inputStyle}
            defaultValue={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <Button inline inverted style={styles.button} onPress={handleButtonPress}>
          Create
        </Button>
        <IconButton
          icon="keyboard-backspace"
          size={30}
          style={styles.navButton}
          color="#20E4B5"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D3F4D",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  button: {
    backgroundColor: "#20E4B5",
    height: 50,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    top: 30,
    borderRadius: 30,
  },
  formContainer: {
    bottom: 60,
    alignItems: "center",
  },
  formLabel: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  inputStyle: {
    width: 300,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  navButton: {
    top: 40
  }
});

export default NewGroupScreen;
