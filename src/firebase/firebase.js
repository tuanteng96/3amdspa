import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDBEkG1zcG5WtaMxXgNdTKdn90cgIGr7SI",
    authDomain: "amdspa-9ac19.firebaseapp.com",
    databaseURL: "https://amdspa-9ac19.firebaseio.com",
    projectId: "amdspa-9ac19",
    storageBucket: "amdspa-9ac19.appspot.com",
    messagingSenderId: "659913329566",
    appId: "1:659913329566:web:73a74972cf8d54cf89648f",
    measurementId: "G-YFFY79H7HQ"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);
export { auth, database };