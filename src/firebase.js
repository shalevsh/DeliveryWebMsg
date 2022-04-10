import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCVJR_BMTGo-tSbnuZFis8GW4cOg9knTIs",
  authDomain: "hometask-a2f16.firebaseapp.com",
  projectId: "hometask-a2f16",
  storageBucket: "hometask-a2f16.appspot.com",
  messagingSenderId: "126836864581",
  appId: "1:126836864581:web:cd39168cbc0087c7e0552c",
  measurementId: "G-CYBMJ2NPD2",
};

export const app = firebase.initializeApp(firebaseConfig);
