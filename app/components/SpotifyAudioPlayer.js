import React from "react";
import { TouchableOpacity, View, Image, StyleSheet, Text } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { firestore } from '../firebase';
import { playMusic, pauseMusic, skipForward, skipPrevious, currentTrackPlaying } from '../spotify';

export default class App extends React.Component {
  state = {
    isPlaying: false,
    playbackInstance: null,
    currentIndex: 0,
    volume: 1.0,
    isBuffering: false,
    playlistName: '',
    // currSong: this.getFirstSong(this.props.audioFiles),
    // songIdArray: this.getIdKeys(this.props.audioFiles),
  }

  handlePlayPauseLocal = async () => {
    // const { isPlaying, playbackInstance } = this.state;

    // isPlaying ? 
    // await pauseMusic() : 
    // await playMusic();
 
    // this.setState({
    //   isPlaying: !isPlaying
    // });
    console.log('!!!!!!!!!!!')
  }

  async componentDidMount() {
    console.log(this.state.playlistName);
    firestore.collection('Group Rooms')
      .doc(this.props.roomId)
      .onSnapshot(doc => {
        if(doc.data()) {
          this.setState({ playlistName: doc.data().playlistName })
          if (doc.data().currentSong.isPlaying !== this.state.isPlaying) {
            this.handlePlayPauseLocal();
          } else if (doc.data().currentSong.songId !== this.state.currSong) {
            this.setState({ currSong : doc.data().currentSong.songId});
          }
        }
      });
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
    const { isPlaying } = this.state;
    console.log('isPlayinggg', isPlaying);

    if (isPlaying === true) {
      await pauseMusic();
    } else {
        await playMusic(this.props.playlist.uri);
        const data = await currentTrackPlaying();
        console.log('DATAAA', data);
    }
 
    this.setState({
      isPlaying: !isPlaying
    });
  };

  handleNextTrack = async () => {
    await skipForward();
  };

  handlePreviousTrack = async () => {
    await skipPrevious();
  };


//   async updateCurrentSong(newSongId) {
//     const { title } = this.props.audioFiles[newSongId];
//     const roomId = this.props.roomId;
//     const groupDoc = firestore.collection('Group Rooms').doc(roomId);

//     groupDoc.update({
//       currentSong: {
//         isPlaying: true,
//         name: title,
//         songId: newSongId
//       }
//     })

//     this.setState({
//       isPlaying: true
//     });
//   };

//   handlePreviousTrack = async () => {
//     let { playbackInstance, currentIndex, songIdArray } = this.state;

//     if (playbackInstance) {
//       await playbackInstance.unloadAsync();
//       await this.updateIsPlaying();

//       currentIndex < 1
//       ? currentIndex = songIdArray.length - 1
//       : currentIndex -= 1;

//       this.updateCurrentSong(songIdArray[currentIndex]);
//       this.loadAudio();

//       this.setState({
//         currentIndex
//       });
//     }
//   }
  
//   handleNextTrack = async () => {
//     let { playbackInstance, currentIndex, songIdArray } = this.state;

//     if (playbackInstance) {
//       await playbackInstance.unloadAsync();
//       await this.updateIsPlaying();

//       currentIndex < songIdArray.length - 1
//       ? currentIndex = currentIndex + 1
//       : currentIndex = 0;

//       this.updateCurrentSong(songIdArray[currentIndex]);
//       this.loadAudio();

//       this.setState({
//         currentIndex
//       });
//     }
//   }

  render() {
    return (
      <View style={styles.container}>
        {/* <Image
          style={styles.albumCover}
          source={require('../assets/vinyl.png')}
        /> */}
        <View style={styles.trackInfo}>
          <Text style={[styles.trackInfoText, styles.largeText]}>
            { this.state.playlistName }
          </Text>
        </View>
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
    top: 120
  },
  largeText: {
    fontSize: 30,
  },
  trackInfo: {
    top: 40
  },
  trackInfoText: {
    textAlign: "center",
    flexWrap: "wrap",
  },
});
