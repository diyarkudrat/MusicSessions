import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-ios-kit";
import SpotifyAudioPlayer from '../components/SpotifyAudioPlayer';
import { endGroupSession, leaveGroupSession, firestore } from '../firebase';


function GroupScreen({ route, navigation} ) {
  const { newGroup, user, playlist } = route.params;
  const [leaderValue, setLeaderValue] = useState("");
  const [sessionUsers, setSessionUsers] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  
  useEffect(() => {
    let isCancelled = true;

    async function fetchData() {

      const collection = firestore.collection('Group Rooms');

      collection.doc(newGroup.id).onSnapshot(doc => {
        if (doc.data()) {
          const { leader, users } = doc.data();

          setLeaderValue(leader);
          setSessionUsers(users);

          if (leader === user.userId) {
            setIsLeader(true);
          }
        }
      })
    }
    fetchData();
    
    return () => { isCancelled = false };
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
    try {
      const leaveSessionMessage = `You have left ${newGroup.roomName}`;
  
      await leaveGroupSession(user.uid, newGroup.id);
  
      navigation.navigate('Home', {
        leaveMessage: leaveSessionMessage,
        endMessage: null
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.buttonContainer}>
        { leaderValue === user.uid ? <Button inline inverted style={styles.button} onPress={endSession}>End Session</Button> : null }
        <Button inline inverted style={styles.button} onPress={leaveSession}>
          Leave
        </Button>
      </View>
      <View style={styles.musicContainer}>
        <Text style={styles.roomName}>{newGroup.roomName}</Text>
        <Text style={styles.text}>Share this Group Code for Others to Join!</Text>
        <Text style={styles.groupCode}>{newGroup.code}</Text>
        <Text style={styles.text}>Group Leader : {leaderValue}</Text>
        { leaderValue === null ? <Button inline inverted  onPress={() => navigation.navigate('VoteNewLeader', {
          users: sessionUsers,
          roomId: newGroup.id,
        })}>Vote for New Leader</Button> : null }
        <Button inline inverted style={styles.spotifyButton} onPress={() => navigation.navigate('SearchSong')}>Search For Song!</Button>
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
  groupCode: {
    bottom: 10,
    fontSize: 30,
    marginTop: 10,
    textDecorationLine: 'underline'
  },
  musicContainer: {
    justifyContent: "center",
    alignItems: "center",
    top: 200,
  },
  roomName: {
    fontWeight: '300',
    bottom: 50,
    fontSize: 50,
    color: '#2D3F4D',
    marginTop: 10
  },
  spotifyButton: {
    backgroundColor: "#20E4B5",
    height: 50,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    top: 50,
    borderRadius: 30,
  },
  text: {
    bottom: 10,
    marginTop: 10,
    fontSize: 20
  }
});

export default GroupScreen;
