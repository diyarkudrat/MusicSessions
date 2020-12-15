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
    isBuffering: false
  }

  async componentDidMount() {
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

  // componentDidUpdate() {
    
  // }

  async updateIsPlaying(songId, isPlaying) {
    const songsRef = firestore.collection('Songs');
    const docRef = await songsRef.doc(songId).get();
    docRef.ref.update({
      isPlaying: isPlaying
    })
  };

  async loadAudio() {
    const {currentIndex, isPlaying, volume} = this.state
   
    try {
      const playbackInstance = new Audio.Sound()
      const source = {
        uri: this.props.audioFiles[currentIndex].uri
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
    const { isPlaying, playbackInstance } = this.state
    isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
 
    this.setState({
      isPlaying: !isPlaying
    })

    // await this.updateIsPlaying()
  }

  handlePreviousTrack = async () => {
    let { playbackInstance, currentIndex } = this.state
    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      await this.updateIsPlaying(this.props.audioFiles[currentIndex].id, false);
      // console.log('CURRENT SONG ID', this.props.audioFiles[currentIndex].id);
      currentIndex < 1
        ? currentIndex = this.props.audioFiles.length - 1
        : currentIndex -= 1;
      this.setState({
        currentIndex
      })
      await this.updateIsPlaying(this.props.audioFiles[currentIndex].id, true);
      this.loadAudio()
    }
  }

  handleNextTrack = async () => {
    let { playbackInstance, currentIndex } = this.state
    if (playbackInstance) {
      await playbackInstance.unloadAsync()
      await this.updateIsPlaying(this.props.audioFiles[currentIndex].id, false);
      currentIndex < this.props.audioFiles.length - 1
        ? currentIndex = currentIndex + 1
        : currentIndex = 0;
      this.setState({
        currentIndex
      })
      await this.updateIsPlaying(this.props.audioFiles[currentIndex].id, true);
      this.loadAudio()
    }
  }

  renderFileInfo() {
    const { playbackInstance, currentIndex } = this.state
    return playbackInstance ? (
      <View style={styles.trackInfo}>
        <Text style={[styles.trackInfoText, styles.largeText]}>
          {this.props.audioFiles[currentIndex].title}
        </Text>
        <Text style={[styles.trackInfoText, styles.smallText]}>
          {this.props.audioFiles[currentIndex].author}
        </Text>
        <Text style={[styles.trackInfoText, styles.smallText]}>
          {this.props.audioFiles[currentIndex].source}
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


// function AudioPlayer(props) {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playbackInstance, setPlaybackInstance] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [volume, setVolume] = useState(1.0);
//   const [isBuffering, setIsBuffering] = useState(false);

//   const soundObject = new Audio.Sound();

//   useEffect(() => {
//     async function fetchData() {
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: false,
//         interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
//         playsInSilentModeIOS: true,
//         interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
//         shouldDuckAndroid: true,
//         staysActiveInBackground: true,
//         playThroughEarpieceAndroid: true,
//       });

//       loadAudio();
//     }
//     fetchData();
//   }, []);

//   const loadAudio = async () => {
//     try {
//       console.log('PROPS', props);
//       const source = { uri: props.audioFiles[currentIndex].uri };
//       const status = {
//         shouldPlay: isPlaying,
//         volume,
//       };
//       soundObject.setOnPlaybackStatusUpdate(setIsBuffering(status.isBuffering));
//       await soundObject.loadAsync(source, status, false);
//       setPlaybackInstance(soundObject);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handlePlayPause = async () => {
//     isPlaying
//       ? await playbackInstance.pauseAsync()
//       : await playbackInstance.playAsync();
//     setIsPlaying(!isPlaying);
//   };

//   const handlePreviousTrack = async () => {
//     if (playbackInstance) {
//       await playbackInstance.unloadAsync();
//       currentIndex < 1
//         ? setCurrentIndex(props.audioFiles.length - 1)
//         : setCurrentIndex(currentIndex - 1);
//       loadAudio();
//     }
//   };

//   const handleNextTrack = async () => {
//     if (playbackInstance) {
//       await playbackInstance.unloadAsync();
//       currentIndex < props.audioFiles.length - 1
//         ? setCurrentIndex(currentIndex + 1)
//         : setCurrentIndex(0);
//     }
//   };

//   const renderFileInfo = () => {
//     return playbackInstance ? (
//       <View style={styles.trackInfo}>
//         <Text style={[styles.trackInfoText, styles.largeText]}>
//           {props.audioFiles[currentIndex].title}
//         </Text>
//       </View>
//     ) : null;
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.controls}>
//         <TouchableOpacity
//           style={styles.control}
//           onPress={handlePreviousTrack}
//         >
//           <AntDesign name="stepbackward" size={45} color="#444" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.control} onPress={handlePlayPause}>
//           {isPlaying ? (
//             <Ionicons name="ios-pause" size={48} color="#444" />
//           ) : (
//             <Ionicons name="ios-play-circle" size={48} color="#444" />
//           )}
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.control} onPress={handleNextTrack}>
//           <AntDesign name="stepforward" size={45} color="#444" />
//         </TouchableOpacity>
//       </View>
//       {renderFileInfo()}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   albumCover: {
//     width: 250,
//     height: 250,
//   },
//   control: {
//     margin: 20,
//   },
//   controls: {
//     flexDirection: "row",
//   },
//   largeText: {
//     fontSize: 30,
//   },
//   trackInfo: {
//     padding: 40,
//   },
//   trackInfoText: {
//     textAlign: "center",
//     flexWrap: "wrap",
//   },
// });

// export default AudioPlayer;
