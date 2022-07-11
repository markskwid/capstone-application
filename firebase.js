// Import the functions you need from the SDKs you need
import * as firebase from 'firebase'
import { getAnalytics } from "firebase/analytics";
import "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app =  firebaseConfig = {
  apiKey: "AIzaSyC8U6fT7gT4dSn7faPZuuUzdLlKpkihwlg",
  authDomain: "trendz-ph.firebaseapp.com",
  databaseURL: "https://trendz-ph-default-rtdb.firebaseio.com",
  projectId: "trendz-ph",
  storageBucket: "trendz-ph.appspot.com",
  messagingSenderId: "921243198338",
  appId: "1:921243198338:web:3e29dcaeae682c551b659b",
  measurementId: "${config.measurementId}"
};



export const fireDB = app.firestore();
export default app;