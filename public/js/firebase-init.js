// web app´s firebase
const firebaseConfig = {
    apiKey: "AIzaSyCei9jdgXmTfqBl7yV88xMdptyGb2cRAV4",
    authDomain: "projeto-tatualize.firebaseapp.com",
    projectId: "projeto-tatualize",
    storageBucket: "projeto-tatualize.appspot.com",
    messagingSenderId: "238650155328",
    appId: "1:238650155328:web:eedc69aa2261d9e9565aa5",
    databaseURL: "https://projeto-tatualize-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);

// Referência ao provedor do Google
const provider = new firebase.auth.GoogleAuthProvider();
