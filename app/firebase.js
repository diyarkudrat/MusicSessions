import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDTdlaw_N7P4tnZWmu85djbNhaW9zfPCmc",
  authDomain: "react-native-take-home.firebaseapp.com",
  projectId: "react-native-take-home",
  storageBucket: "react-native-take-home.appspot.com",
  messagingSenderId: "97743295721",
  appId: "1:97743295721:web:bfef52dcf4bda369084c78",
  measurementId: "G-Q2XCKWXDNT",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export const auth = firebase.auth();
export const firestore = firebase.firestore();


export const createNewGroup = async (name) => {
  const groupCode = Math.floor(Math.random()*90000) + 10000;

  await firestore.collection('Group Rooms').add({
    name: name,
    code: groupCode
  })
};