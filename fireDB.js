import * as firebase from 'firebase';
import firestore from 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyC8U6fT7gT4dSn7faPZuuUzdLlKpkihwlg",
    authDomain: "trendz-ph.firebaseapp.com",
    databaseURL: "https://trendz-ph-default-rtdb.firebaseio.com",
    projectId: "trendz-ph",
    storageBucket: "trendz-ph.appspot.com",
    messagingSenderId: "921243198338",
    appId: "1:921243198338:web:3e29dcaeae682c551b659b",
    measurementId: "${config.measurementId}"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  firebase.firestore();
  
  export default firebase;