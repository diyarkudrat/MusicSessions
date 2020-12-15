import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-ios-kit";
import AudioPlayer from "../components/AudioPlayer";
import { endGroupSession, leaveGroupSession, getLeaderValue, firestore } from '../firebase';


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
  const [leaderValue, setLeaderValue] = useState("");
  const [sessionUsers, setSessionUsers] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      const groupRef = firestore.collection('Group Rooms');

      groupRef.doc(newGroup.id).onSnapshot(doc => {
        const { leader, users } = doc.data();
        setLeaderValue(leader);
        setSessionUsers(users);

      })
    }
    fetchData();
  }, []);

  const endSession = async () => {
    const endSessionMessage = `You have Ended ${newGroup.roomName}`;
    
    await endGroupSession(newGroup.id);

    navigation.navigate('Home', {
      endMessage: endSessionMessage,
      leaveMessage: null
    });
  };

  const leaveSession = async () => {
    const leaveSessionMessage = `You have left ${newGroup.roomName}`;

    await leaveGroupSession(user.uid, newGroup.id);

    navigation.navigate('Home', {
      leaveMessage: leaveSessionMessage,
      endMessage: null
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.buttonContainer}>
        { newGroup.leader === user.uid ? <Button inline inverted style={styles.button} onPress={endSession}>End Session</Button> : null }
        <Button inline inverted style={styles.button} onPress={leaveSession}>
          Leave
        </Button>
      </View>
      <View style={styles.musicContainer}>
        <Text style={styles.text}>Group Code : {newGroup.code}</Text>
        <Text style={styles.text}>Group Leader : {user.email}</Text>
        { leaderValue === null ? <Button inline inverted  onPress={() => navigation.navigate('VoteNewLeader', {
          users: sessionUsers,
          roomId: newGroup.id,
        })}>Vote for New Leader</Button> : null }
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
  musicContainer: {
    justifyContent: "center",
    alignItems: "center",
    top: 200,
  },
  text: {
    bottom: 50,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2D3F4D',
    marginTop: 10
  }
});

export default GroupScreen;
