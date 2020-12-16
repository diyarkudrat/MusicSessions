import React from "react";
import { TouchableOpacity, View, Image, StyleSheet, Text } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { firestore } from '../firebase';

export default class App extends React.Component {
  state = {
    isPlaying: false,
    playbackInstance: null,
    currentIndex: 0,
    volume: 1.0,
    isBuffering: false,
    currSong: this.getFirstSong(this.props.audioFiles),
    songIdArray: this.getIdKeys(this.props.audioFiles),
  }

  handlePlayPauseLocal = async () => {
    const { isPlaying, playbackInstance } = this.state;

    isPlaying ? 
    await playbackInstance.pauseAsync() : 
    await playbackInstance.playAsync();
 
    this.setState({
      isPlaying: !isPlaying
    });
  }

  async componentDidMount() {
    firestore.collection('Group Rooms')
      .doc(this.props.roomId)
      .onSnapshot(doc => {
        if(doc.data()) {
          if (doc.data().currentSong.isPlaying !== this.state.isPlaying) {
            this.handlePlayPauseLocal();
          } else if (doc.data().currentSong.songId !== this.state.currSong) {
            this.setState({ currSong : doc.data().currentSong.songId});
            this.loadAudio();
          }
        }
      });

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true
      })

      this.loadAudio();
    } catch (e) {
      console.log(e);
    }
  }

  getFirstSong(obj) {
    return Object.keys(obj)[0];
  };
  
  getIdKeys(obj) {
    return Object.keys(obj);
  }

  async loadAudio() {
    const { isPlaying, volume, currSong } = this.state;
   
    try {
      const playbackInstance = new Audio.Sound();
      const song = this.props.audioFiles[currSong];

      const source = {
        uri: song.uri
      };
      const status = {
        shouldPlay: isPlaying,
        volume
      };
   
      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
      await playbackInstance.loadAsync(source, status, false);

      this.setState({playbackInstance});
    } catch (e) {
        console.log(e);
    }
  }

  onPlaybackStatusUpdate = status => {
    this.setState({
      isBuffering: status.isBuffering
    })
  }

  async updateIsPlaying() {
    const roomId = this.props.roomId;
    const collection = firestore.collection('Group Rooms').doc(roomId);
    const data = await collection.get();
    const currentSong = data.data().currentSong;

    collection.update({
      currentSong: {
        ...currentSong,
        isPlaying: !currentSong.isPlaying
      }
    });

    this.setState({
      isPlaying: false
    });
  };

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance } = this.state;

    if (isPlaying === true) {
      await this.updateIsPlaying();
      await playbackInstance.pauseAsync();
    } else {
      await this.updateIsPlaying();
      await playbackInstance.playAsync();
    }
 
    this.setState({
      isPlaying: !isPlaying
    });
  };

  async updateCurrentSong(newSongId) {
    const { title } = this.props.audioFiles[newSongId];
    const roomId = this.props.roomId;
    const groupDoc = firestore.collection('Group Rooms').doc(roomId);

    groupDoc.update({
      currentSong: {
        isPlaying: true,
        name: title,
        songId: newSongId
      }
    })

    this.setState({
      isPlaying: true
    });
  };

  handlePreviousTrack = async () => {
    let { playbackInstance, currentIndex, songIdArray } = this.state;

    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      await this.updateIsPlaying();

      currentIndex < 1
      ? currentIndex = songIdArray.length - 1
      : currentIndex -= 1;

      this.updateCurrentSong(songIdArray[currentIndex]);
      this.loadAudio();

      this.setState({
        currentIndex
      });
    }
  }
  
  handleNextTrack = async () => {
    let { playbackInstance, currentIndex, songIdArray } = this.state;

    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      await this.updateIsPlaying();

      currentIndex < songIdArray.length - 1
      ? currentIndex = currentIndex + 1
      : currentIndex = 0;

      this.updateCurrentSong(songIdArray[currentIndex]);
      this.loadAudio();

      this.setState({
        currentIndex
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.albumCover}
          source={require('../assets/vinyl.png')}
        />
        { this.props.isLeader ?
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.control}
              onPress={this.handlePreviousTrack}
            >
              <AntDesign name="stepbackward" size={45} color="#444" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
              {this.state.isPlaying ? (
                <Ionicons name="ios-pause" size={48} color="#444" />
              ) : (
                <Ionicons name="ios-play-circle" size={48} color="#444" />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.control} onPress={this.handleNextTrack}>
              <AntDesign name="stepforward" size={45} color="#444" />
            </TouchableOpacity>
          </View> : null
        }
        { this.state.playbackInstance ?
          <View style={styles.trackInfo}>
            <Text style={[styles.trackInfoText, styles.largeText]}>
              { this.props.audioFiles[this.state.currSong].title }
            </Text>
          </View>
          : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  albumCover: {
    width: 250,
    height: 250,
  },
  control: {
    margin: 20,
  },
  controls: {
    flexDirection: "row",
  },
  largeText: {
    fontSize: 30,
  },
  trackInfo: {
    padding: 40,
  },
  trackInfoText: {
    textAlign: "center",
    flexWrap: "wrap",
  },
});
