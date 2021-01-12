import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    ScrollView
  } from "react-native";
import { Button } from "react-native-ios-kit";
import { CheckBox, Image } from 'react-native-elements';
import { IconButton } from "react-native-paper";
import { accessTokenAPI, searchQuery, addQueue } from '../spotify';
import { useAuthRequest, ResponseType } from 'expo-auth-session';

const authEndpoints = {
authorizationEndpoint: 'https://accounts.spotify.com/authorize',
tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

function SearchScreen({ route, navigation }) {
    const [query, setQuery] = useState('');
    const [data, setData] = useState([]);
    const [chosenSong, setChosenSong] = useState('');
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        if (res?.type === 'success') {
            const { access_token } = res.params;

            setAccessToken(access_token);
            console.log('TOKENNN', accessToken);
        }
    }, [res]);

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

    const displaySearchBar = () => {
        return (
            <>
            <TextInput
              placeholder="Enter Name"
              labelName="query"
              style={styles.formInput}
              value={query}
              onChangeText={(event) => setQuery(event)}
            />
            <Button inline inverted style={styles.searchButton} onPress={getSearchData}>Search</Button>
            </>
        )
    };

    const getSearchData = async () => {
        await accessTokenAPI(accessToken);
        const songsData = await searchQuery(query);
        const updateData = songsData.tracks.items.map((song) => {
            return { song, checked: false };
        });

        setData(updateData);
    };

    const displaySearchData = () => {
        return <View style={{ height: 200, top: 40 }}>
        <ScrollView>
          {data.map((song) => {
            return (
              <CheckBox center title={song.song.name} key={song.song.id} checked={song.checked} onPress={() => handleOnPress(song)} />
            )
          })}
        </ScrollView>
      </View>
    };

    const handleOnPress = (checkedSong) => {
        const updatedSongsData = data.map(song => {
          if (song.song.id === checkedSong.song.id) {
            return { ...song, checked: true };
          }
          
          return song;
        });
        
        setData(updatedSongsData);
        setChosenSong(checkedSong.song.uri);
    };

    const addToQueue = async () => {
        await accessTokenAPI(accessToken);
        await addQueue(chosenSong);

        alert('Song Successfully Added to Queue!');

        setTimeout(() => {
            navigation.navigate('GroupSession');
        }, 3000);
    }


    return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for a Song to Add to the Queue!</Text>
      { res?.type === 'success' ? displaySearchBar() : <Button inline inverted style={styles.spotifyButton} disabled={!req} onPress={() => {
            promptAsync();
        }}>
            Login to Spotify
        </Button> }
      
      { data ? displaySearchData() : null }
      { chosenSong ? <Button inline inverted style={styles.spotifyButton} onPress={addToQueue}>Add to Queue</Button> : null }
    
      <IconButton
        icon="keyboard-backspace"
        size={30}
        style={styles.navButton}
        color="#20E4B5"
        onPress={() => navigation.goBack()}
      />
    </View>
    );
};

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
      top: 60
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
      color: "#fff",
      fontWeight: "bold",
    },
    searchButton: {
        backgroundColor: "#20E4B5",
        height: 50,
        width: 300,
        justifyContent: "center",
        alignItems: "center",
        top: 10,
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
  });

export default SearchScreen;