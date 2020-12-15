import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-ios-kit";
import AudioPlayer from "../components/AudioPlayer";
import { endGroupSession, leaveGroupSession, getLeaderValue, getAudioDocuments, firestore } from '../firebase';
import downloadAudioFiles from '../fileSystem';


function GroupScreen({ route, navigation} ) {
  const { newGroup, user } = route.params;
  const [leaderValue, setLeaderValue] = useState("");
  const [sessionUsers, setSessionUsers] = useState([]);
  const [audioFiles, setAudioFiles] = useState();
  
  useEffect(() => {
    async function fetchData() {
      const groupRef = firestore.collection('Group Rooms');

      groupRef.doc(newGroup.id).onSnapshot(doc => {
        const { leader, users } = doc.data();
        setLeaderValue(leader);
        setSessionUsers(users);
      })

      const audioDocs = await getAudioDocuments();
      let playlist = [];
      audioDocs.docs.map(async (doc) => {
        const { fileName, url } = doc.data();
        const uri = await downloadAudioFiles(url, fileName);
        playlist.push({ title: fileName, uri: uri });
      });
      setAudioFiles(playlist);
      
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
        <AudioPlayer audioFiles={audioFiles} />
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
