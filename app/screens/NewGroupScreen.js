import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-ios-kit";
import { CheckBox } from 'react-native-elements';
import { IconButton } from "react-native-paper";
import { useAuthRequest, ResponseType } from 'expo-auth-session';
import { createNewGroup } from '../firebase';
import { accessTokenAPI, getCurrentUserPlaylists } from '../spotify';

const authEndpoints = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};


function NewGroupScreen({ route, navigation }) {
  const [name, setName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [chosenPlaylist, setChosenPlaylist] = useState({});
  const { user } = route.params;

  const [req, res, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: '1b1e017c24664c55b32c923a503231e9',
      scopes: ['user-modify-playback-state', 'playlist-read-private'],
      usePKCE: false,
      redirectUri: 'exp://127.0.0.1:19000/--/redirect',
    },
    authEndpoints
  );

  useEffect(() => {
    if (res?.type === 'success') {
      const { access_token } = res.params;

      handlePlaylistData(access_token);
    }
  }, [res]);

  const handlePlaylistData = async (accessToken) => {
    await accessTokenAPI(accessToken);
    const playlistsData = await getCurrentUserPlaylists();

    const data = playlistsData.items.map((playlist) => {
      return { playlist, checked: false };
    })

    setPlaylists(data);
  };

  const showPlaylists = () => {
    return <View style={{ height: 200 }}>
      <ScrollView style={styles.playlistList}>
        {playlists.map((playlist) => {
          return (
            <CheckBox center title={playlist.playlist.name} key={playlist.playlist.id} checked={playlist.checked} onPress={() => handleOnPress(playlist)} />
          )
        })}
      </ScrollView>
    </View>
  };

  const handleOnPress = (clickedPlaylist) => {
    
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.playlist.id === clickedPlaylist.playlist.id) {
        return { ...playlist, checked: true };
      }
      
      return playlist;
    });
    
    setPlaylists(updatedPlaylists)
    setChosenPlaylist(clickedPlaylist.playlist);
  };
  
  const handleButtonPress = async () => {
    if (name.length > 0 && chosenPlaylist) {
      const newGroup = await createNewGroup(name, user, chosenPlaylist);

      navigation.navigate('GroupSession', {
        newGroup: newGroup,
        
        user: user,
        playlist: chosenPlaylist
      });
    } else {
      alert('Enter Name and Select Playlist')
    }
  };

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
          { res?.type === 'success' ? showPlaylists() : <Button inline inverted style={styles.spotifyButton} disabled={!req} onPress={() => {
            promptAsync();
          }}>
            Login to Spotify
          </Button> }
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
  spotifyButton: {
    backgroundColor: "#20E4B5",
    height: 50,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    top: 50,
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
    top: 60
  },
  playlistList: {
    flex: 1,
    top: 50,
  }
});

export default NewGroupScreen;
