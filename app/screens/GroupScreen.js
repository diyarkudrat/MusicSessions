import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { Button } from "react-native-ios-kit";
import AudioPlayer from "../components/AudioPlayer";
import { endGroupSession } from '../firebase';


const audioPlaylist = [
  {
    title: "Audio #1",
    uri:
      "https://ia800204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act1_shakespeare.mp3",
    imgSource:
      "http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg",
  },
  {
    title: "Audio #2",
    uri:
      "https://ia600204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act2_shakespeare.mp3",
    imgSource:
      "http://www.pngmart.com/files/7/Red-Smoke-Transparent-Images-PNG.png",
  },
  {
    title: "Audio #3",
    uri:
      "http://www.archive.org/download/hamlet_0911_librivox/hamlet_act3_shakespeare.mp3",
    imgSource:
      "http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg",
  },
];

function GroupScreen({ route, navigation} ) {
  const { newGroup, user } = route.params;

  const handleButtonPress = async () => {
    await endGroupSession(newGroup.id);
    const endSessionMessage = "You Have Ended the Group Session";
    navigation.navigate('Home', {
      message: endSessionMessage
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.buttonContainer}>
        { newGroup.leader === user.uid ? <Button inline inverted style={styles.button} onPress={handleButtonPress}>End Session</Button> : null }
        <Button inline inverted style={styles.button} onPress={() => navigation.navigate('Home')}>
          Leave
        </Button>
      </View>
      <View style={styles.musicContainer}>
        <AudioPlayer audioPlaylist={audioPlaylist} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#20E4B5",
    height: 50,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    top: 30,
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  container: {
    backgroundColor: '#2D3F4D'
  },
  musicContainer: {
    justifyContent: "center",
    alignItems: "center",
    top: 200,
  },
});

export default GroupScreen;
