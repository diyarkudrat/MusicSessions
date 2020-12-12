import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Image, StyleSheet, Text } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";

function AudioPlayer(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isBuffering, setIsBuffering] = useState(false);

  const soundObject = new Audio.Sound();

  useEffect(() => {
    async function fetchData() {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true,
      });

      loadAudio();
    }
    fetchData();
  }, []);

  const loadAudio = async () => {
    try {
      const source = { uri: props.audioPlaylist[currentIndex].uri };
      const status = {
        shouldPlay: isPlaying,
        volume,
      };
      soundObject.setOnPlaybackStatusUpdate(setIsBuffering(status.isBuffering));
      await soundObject.loadAsync(source, status, false);
      setPlaybackInstance(soundObject);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePlayPause = async () => {
    isPlaying
      ? await playbackInstance.pauseAsync()
      : await playbackInstance.playAsync();
    setIsPlaying(!isPlaying);
  };

  const handlePreviousTrack = async () => {
    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      currentIndex < 1
        ? setCurrentIndex(props.audioPlaylist.length - 1)
        : setCurrentIndex(currentIndex - 1);
      loadAudio();
    }
  };

  const handleNextTrack = async () => {
    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      currentIndex < props.audioPlaylist.length - 1
        ? setCurrentIndex(currentIndex + 1)
        : setCurrentIndex(0);
    }
  };

  const renderFileInfo = () => {
    return playbackInstance ? (
      <View style={styles.trackInfo}>
        <Text style={[styles.trackInfoText, styles.largeText]}>
          {props.audioPlaylist[currentIndex].title}
        </Text>
      </View>
    ) : null;
  };

  return (
    <>
      <View style={styles.container}>
        <Image
          style={styles.albumCover}
          source={require("../assets/icon.png")}
        />
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.control}
            onPress={handlePreviousTrack}
          >
            <AntDesign name="stepbackward" size={45} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.control} onPress={handlePlayPause}>
            {isPlaying ? (
              <Ionicons name="ios-pause" size={48} color="#444" />
            ) : (
              <Ionicons name="ios-play-circle" size={48} color="#444" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.control} onPress={handleNextTrack}>
            <AntDesign name="stepforward" size={45} color="#444" />
          </TouchableOpacity>
        </View>
        {renderFileInfo()}
      </View>
    </>
  );
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

export default AudioPlayer;
