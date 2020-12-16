import React, { useEffect, useState, useRef } from "react";
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
    currSong: this.randomSong(this.props.audioFiles),
  }

  async componentDidMount() {
    firestore.collection('Group Rooms')
      .doc(this.props.roomId)
      .collection('Songs')
      .onSnapshot(docs => {
        docs.forEach(doc => {
          if (doc.data().isPlaying === true) {
            this.setState({ currSong: doc.id });
          }
        })
      })

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

      this.loadAudio()
    } catch (e) {
      console.log(e)
    }
  }

  randomSong(obj) {
    return Object.keys(obj)[0];
  };  

  async updateIsPlaying(songId, isPlaying) {
    const roomId = this.props.roomId;
    const songsRef = firestore.collection('Group Rooms').doc(roomId).collection('Songs');

    songsRef.doc(songId).update({
      isPlaying: isPlaying
    })
  };

  async loadAudio() {
    const { isPlaying, volume, currSong } = this.state
   
    try {
      const playbackInstance = new Audio.Sound()
      const song = this.props.audioFiles[currSong];

      const source = {
        uri: song.uri
      }
   
      const status = {
        shouldPlay: isPlaying,
        volume
      }
   
      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)     
      await playbackInstance.loadAsync(source, status, false)
      this.setState({playbackInstance})
    } catch (e) {
        console.log(e)
    }
  }

  onPlaybackStatusUpdate = status => {
    this.setState({
      isBuffering: status.isBuffering
    })
  }

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance, currSong } = this.state

    if (isPlaying === true) {
      await this.updateIsPlaying(currSong, false);
      await playbackInstance.pauseAsync();
    } else {
      await this.updateIsPlaying(currSong, true);
      await playbackInstance.playAsync();
    }
 
    this.setState({
      isPlaying: !isPlaying
    })
  }

  handlePreviousTrack = async () => {
    let { playbackInstance, currentIndex } = this.state
    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      // await this.updateIsPlaying(this.props.audioFiles[currentIndex].id, false);
      currentIndex < 1
        ? currentIndex = this.props.audioFiles.length - 1
        : currentIndex -= 1;
      this.setState({
        currentIndex
      })
      // await this.updateIsPlaying(this.props.audioFiles[currentIndex].id, true);
      this.loadAudio()
    }
  }

  handleNextTrack = async () => {
    let { playbackInstance, currentIndex } = this.state
    if (playbackInstance) {
      await playbackInstance.unloadAsync()
      // await this.updateIsPlaying(this.props.audioFiles[currentIndex].id, false);
      currentIndex < this.props.audioFiles.length - 1
        ? currentIndex = currentIndex + 1
        : currentIndex = 0;
      this.setState({
        currentIndex
      })
      // await this.updateIsPlaying(this.props.audioFiles[currentIndex].id, true);
      this.loadAudio()
    }
  }

  renderFileInfo() {
    const { playbackInstance, currSong } = this.state
    return playbackInstance ? (
      <View style={styles.trackInfo}>
        <Text style={[styles.trackInfoText, styles.largeText]}>
          {this.props.audioFiles[currSong].title}
        </Text>
      </View>
    ) : null
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.albumCover}
          source={require('../assets/vinyl.png')}
        />
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
        </View>
        {this.renderFileInfo()}
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
