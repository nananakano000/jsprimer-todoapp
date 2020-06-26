import firebase from 'firebase';

console.log(firebase)

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: 'AIzaSyDPbduLelOU43Xzh1rENsIrKTYWUA94Be4',
        authDomain: 'todoapp-7eb84.firebaseapp.com',
        databaseURL: 'https://todoapp-7eb84.firebaseio.com',
        projectId: 'todoapp-7eb84',
        storageBucket: 'todoapp-7eb84.appspot.com',
        messagingSenderId: '572938808469',
        appId: '1:572938808469:web:3f946627504535337fff9c',
        measurementId: 'G-F2QJ1MH06N',
    });
}

export default firebase;
