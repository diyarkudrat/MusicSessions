import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import downloadAudioFiles from './fileSystem';

const firebaseConfig = {
  apiKey: "AIzaSyDJ1K_u9lRRtkP6pzbZzN2-0mFWesMaTb8",
  authDomain: "music-sessions-rn.firebaseapp.com",
  projectId: "music-sessions-rn",
  storageBucket: "music-sessions-rn.appspot.com",
  messagingSenderId: "190063416356",
  appId: "1:190063416356:web:02d235d69d0aaf309974b1",
  measurementId: "G-HEXX8KJPBF"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export const auth = firebase.auth();
export const firestore = firebase.firestore();

const MAX_SONGS = 3;

// Create new Session
export const createNewGroup = async (name, user) => {
  const groupCode = Math.floor(Math.random()*90000) + 10000;
  const newRoom = await firestore.collection('Group Rooms').add({
    roomName: name,
    code: groupCode,
    leader: user.uid,
    users: [user.uid]
  });
  const { id } = newRoom;
  const { code, leader, roomName } = await getGroupSession(id);
  const data = { id, code, leader, roomName };

  return data;
};

// GET Session data
const getGroupSession = async (id) => {
  const groupRef = firestore.collection('Group Rooms');
  const snapshot = await groupRef.doc(id).get();
  const data = snapshot.data();
  
  return data;
};

// GET Session leader
export const getLeaderValue = async (id) => {
  const groupRef = firestore.collection('Group Rooms');
  const snapshot = await groupRef.doc(id).get();
  const { leader } = snapshot.data();

  return leader;
};

// Join a Session by Code
export const joinGroupSession = async (groupCode, userId) => {
  const groupRef = firestore.collection('Group Rooms');
  const querySnapshot = await groupRef.where('code', '==', parseInt(groupCode)).get();
  const roomRef = querySnapshot.docs[0];
  roomRef.ref.update({
    users: firebase.firestore.FieldValue.arrayUnion(userId)
  })
  const roomId = roomRef.id;

  const { code, leader, roomName, users } = roomRef.data();
  const data = { id: roomId, code, leader, roomName, users }

  return data;
};

// End a Session || Delete session document from firestore
export const endGroupSession = async (id) => {
  const groupRef = firestore.collection('Group Rooms');
  const roomRef = await groupRef.doc(id);
  await roomRef.delete(); 
};

// Leave a Session
export const leaveGroupSession = async (userId, roomId) => {
  try {
    const groupRef = firestore.collection('Group Rooms');
    const roomRef = await groupRef.doc(roomId).get();
    
    // Remove user from the array of users in Session document
    roomRef.ref.update({
      users: firebase.firestore.FieldValue.arrayRemove(userId)
    });

    const docRef = groupRef
      .doc(roomId)
      .onSnapshot(doc => {
        // If No one left in group, delete session document in firestore
        if (doc.data().users.length === 0) {
          docRef();
          endGroupSession(roomId);
        } else {
          const sessionUsers = doc.data().users;
          const sessionLeader = doc.data().leader;

          // if session leader left, update document Leader field to null
          if (!sessionUsers.includes(sessionLeader)) {
            roomRef.ref.update({ leader: null });

            setElectLeader(sessionUsers, roomRef);
          };
        };
      });
  } catch (err) {
    console.log(err);
  };
};

// update Leader field to the user with the most elected votes
export const updateNewLeader = async (roomId) => {
  const groupRef = firestore.collection('Group Rooms');
  const roomRef = await groupRef.doc(roomId).get();
  
  try {
    const docRef = groupRef.doc(roomId).onSnapshot(doc => {
      if (doc.data().leader === null) {     
        const newLeader = getNewLeader(doc.data().electLeader);
    
        roomRef.ref.update({ leader: newLeader[0] });
        docRef();
        return newLeader;
      }
      return doc.data().leader;
    });
  } catch (err) {
    console.log('updateNewLeader() error', err);
  };
};

// Return new elected leader
const getNewLeader = object => {
  const newLeader = Object.keys(object).filter(x => {
    return object[x] == Math.max.apply(null,
      Object.values(object));
  });

  return newLeader[0];
};
  
// set the object that keeps track of vote count in document
const setElectLeader = (users, roomRef) => {
  let electLeaderUsers = {};

  users.forEach(user => {
    electLeaderUsers[user] = 0;
  });

  roomRef.ref.update({
    electLeader: electLeaderUsers,
    waitingUsers: []
  });
};

// Increase the vote count for the passed in user
export const updateElectNewLeader = async (user, roomId) => {
  const groupRef = firestore.collection('Group Rooms');
  const roomRef = await groupRef.doc(roomId).get();
  const votedLeader = `electLeader.${user}`;

  roomRef.ref.update({
    [votedLeader]: firebase.firestore.FieldValue.increment(1)
  });
};

// update the array of users who have voted already
export const updateWaitingUsers = async (roomId, userId) => {
  const groupRef = firestore.collection('Group Rooms');
  const roomRef = await groupRef.doc(roomId).get();

  roomRef.ref.update({
    waitingUsers: firebase.firestore.FieldValue.arrayUnion(userId)
  });
};

// GET user data
export const getUserInfo = async (id) => {
  const userRef = firestore.collection('Users');
  const snapshot = await userRef.doc(id).get();
  const userData = snapshot.data();

  return userData;
};

// create new User document
export const generateUserDocument = async (user) => {
  if (!user) return;

  const userRef = firestore.doc(`Users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email } = user;
    try {
      await userRef.set({
        email: email,
        userId: user.uid
      });
    } catch (err) {
      console.log('Error creating user document', err);
    }
  }
  return getUserDocument(user.uid);
};

// GET User document from firestore
const getUserDocument = async (uid) => {
  if (!uid) return null;

  try {
    const userDocument = await firestore.doc(`Users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } catch (err) {
    console.log('Error fetching user', err);
  }
};

export const getAudioFiles = async (roomId) => {
  const songsRef = firestore.collection('Songs');
  const roomRef = firestore.collection('Group Rooms').doc(roomId).collection('Songs');
  const docRef = await songsRef.get();
  const docs = docRef.docs;
  const playlist = {};

  // For each document in the Songs Collection
  for (const i in docs) {
    let id;
    const { fileName, url } = docs[i].data();
    const isCollection = await roomRef.get();
    // Download audio files locally to device
    const uri = await downloadAudioFiles(url, fileName);

    // If there isn't a Songs subcollection within the Session document
    // or there's already songs in the subcollection
    if (!isCollection.docs || isCollection.docs.length != MAX_SONGS) {
      const newSongDoc = await roomRef.add({
        fileName,
        isPlaying: false,
      });
      id = newSongDoc.id;
    } else {
      id = (await roomRef.get()).docs[i].id
    }

    playlist[id] = { title: fileName, uri: uri };
  }

  return playlist;
};