import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import downloadAudioFiles from './fileSystem';

const firebaseConfig = {
  apiKey: "AIzaSyBt1qWYaLiOjfQlEQOFFeew2DRbE4ChZcw",
  authDomain: "music-sesssions-rn.firebaseapp.com",
  projectId: "music-sesssions-rn",
  storageBucket: "music-sesssions-rn.appspot.com",
  messagingSenderId: "103972053125",
  appId: "1:103972053125:web:2b77a96936ce57fa0409ec"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export const auth = firebase.auth();
export const firestore = firebase.firestore();

const MAX_SONGS = 3;


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

const getGroupSession = async (id) => {
  const groupRef = firestore.collection('Group Rooms');
  const snapshot = await groupRef.doc(id).get();
  const data = snapshot.data();
  
  return data;
};

export const getLeaderValue = async (id) => {
  const groupRef = firestore.collection('Group Rooms');
  const snapshot = await groupRef.doc(id).get();
  const { leader } = snapshot.data();

  return leader;
};

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

export const endGroupSession = async (id) => {
  const groupRef = firestore.collection('Group Rooms');
  const roomRef = await groupRef.doc(id);
  await roomRef.delete(); 
};

export const leaveGroupSession = async (userId, roomId) => {
  try {
    const groupRef = firestore.collection('Group Rooms');
    const roomRef = await groupRef.doc(roomId).get();
  
    roomRef.ref.update({
      users: firebase.firestore.FieldValue.arrayRemove(userId)
    });

    const docRef = groupRef
      .doc(roomId)
      .onSnapshot(doc => {
        if (doc.data().users.length === 0) {
          docRef();
          endGroupSession(roomId);
        } else {
          const sessionUsers = doc.data().users;
          const sessionLeader = doc.data().leader;
        
          if (!sessionUsers.includes(sessionLeader)) {
            roomRef.ref.update({ leader: null });

            setElectLeader(sessionUsers, roomRef);
          }
        }
      })
  } catch (err) {
    console.log(err);
  }
};

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
  }
};

const getNewLeader = object => {
  const newLeader = Object.keys(object).filter(x => {
    return object[x] == Math.max.apply(null,
      Object.values(object));
  });

  return newLeader[0];
};
  

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

export const updateElectNewLeader = async (user, roomId) => {
  const groupRef = firestore.collection('Group Rooms');
  const roomRef = await groupRef.doc(roomId).get();
  const votedLeader = `electLeader.${user}`;

  roomRef.ref.update({
    [votedLeader]: firebase.firestore.FieldValue.increment(1)
  });
};

export const updateWaitingUsers = async (roomId, userId) => {
  const groupRef = firestore.collection('Group Rooms');
  const roomRef = await groupRef.doc(roomId).get();

  roomRef.ref.update({
    waitingUsers: firebase.firestore.FieldValue.arrayUnion(userId)
  });
};

export const getUserInfo = async (id) => {
  const userRef = firestore.collection('Users');
  const snapshot = await userRef.doc(id).get();
  const userData = snapshot.data();

  return userData;
};

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

  for (const i in docs) {
    let id;
    const { fileName, url } = docs[i].data();
    const isCollection = await roomRef.get();
    const uri = await downloadAudioFiles(url, fileName);

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