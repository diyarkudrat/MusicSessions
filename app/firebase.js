import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

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

// Create new Session
export const createNewGroup = async (name, user) => {
  const groupCode = Math.floor(Math.random()*90000) + 10000;
  const newRoom = await firestore.collection('Group Rooms').add({
    roomName: name,
    code: groupCode,
    leader: user.uid,
    users: [user.uid],
    currentSong: {},
    leaderVotes: []
  });
  const { id } = newRoom;
  const { code, leader, roomName } = await getGroupSession(id);
  const data = { id, code, leader, roomName };

  return data;
};

// GET Session data
const getGroupSession = async (id) => {
  const collection = firestore.collection('Group Rooms');
  const snapshot = await collection.doc(id).get();
  const data = snapshot.data();
  
  return data;
};

// GET Session leader
export const getLeaderValue = async (id) => {
  const collection = firestore.collection('Group Rooms');
  const snapshot = await collection.doc(id).get();
  const { leader } = snapshot.data();

  return leader;
};

// Join a Session by Code
export const joinGroupSession = async (groupCode, userId) => {
  const collection = firestore.collection('Group Rooms');
  const querySnapshot = await collection.where('code', '==', parseInt(groupCode)).get();
  const roomRef = querySnapshot.docs[0];
  const roomId = roomRef.id;

  const { code, leader, roomName, users } = roomRef.data();
  const data = { id: roomId, code, leader, roomName, users }
  
  roomRef.ref.update({
    users: firebase.firestore.FieldValue.arrayUnion(userId)
  })
  
  return data;
};

// End a Session || Delete session document from firestore
export const endGroupSession = async (id) => {
  const collection = firestore.collection('Group Rooms');
  const roomRef = await collection.doc(id);

  await roomRef.delete(); 
};

// Leave a Session
export const leaveGroupSession = async (userId, roomId) => {
  try {
    const collection = firestore.collection('Group Rooms');
    const roomRef = await collection.doc(roomId).get();
    
    // Remove user from the array of users in Session document
    roomRef.ref.update({
      users: firebase.firestore.FieldValue.arrayRemove(userId)
    });

    const docRef = collection
      .doc(roomId)
      .onSnapshot(doc => {
        // If no one left in group, delete session document in firestore
        if (doc.data()) {
          if (doc.data().users.length === 0) {
            docRef();
            endGroupSession(roomId);
          } else {
            const sessionUsers = doc.data().users;
            const sessionLeader = doc.data().leader;

            // if session leader left, update document Leader field to null
            if (!sessionUsers.includes(sessionLeader)) {
              roomRef.ref.update({ leader: null });
            };
          };
        }
      });
  } catch (err) {
    console.log(err);
  };
};

// update Leader field to the user with the most elected votes
export const updateNewLeader = async (roomId) => {
  const collection = firestore.collection('Group Rooms');
  const roomRef = await collection.doc(roomId).get();
  
  try {
    const docRef = collection.doc(roomId).onSnapshot(doc => {
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

// Increase the vote count for the passed in user
export const updateLeaderVotes = async (user, roomId) => {
  const collection = firestore.collection('Group Rooms');
  const roomRef = await collection.doc(roomId).get();

  roomRef.ref.update({
    leaderVotes: firebase.firestore.FieldValue.arrayUnion(user)
  });
};

export const setNewLeader = async (roomId) => {
  const collection = firestore.collection('Group Rooms');
  const roomRef = await collection.doc(roomId).get();
  const { leaderVotes } = roomRef.data();
  const newLeader = mostFreq(leaderVotes);

  roomRef.ref.update({
    leader: newLeader
  });
};

// Helper function to get user with most votes
// Returns first user if tied
function mostFreq(arr) {
  var obj = {}, mostFreq = 0, result = [];

  arr.forEach(user => {
    if (!obj[user]) {
      obj[user] = 1;
    } else {
      obj[user]++;
    }

    if (obj[user] > mostFreq) {
      mostFreq = obj[user];
      result = [user];
    } else if (obj[user] === mostFreq) {
      result.push(user);
    }
  });

  return result[0];
}

// create new User document
export const generateUserDocument = async (user) => {
  if (!user) return;

  const collection = firestore.doc(`Users/${user.uid}`);
  const snapshot = await collection.get();

  if (!snapshot.exists) {
    const { email } = user;

    try {
      await collection.set({
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