import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
    apiKey: "AIzaSyCo_Yk4wQCX41fM7jCIZlMYvfp-eIna5zQ",
    authDomain: "todoapp-vue-27a89.firebaseapp.com",
    projectId: "todoapp-vue-27a89",
    storageBucket: "todoapp-vue-27a89.appspot.com",
    messagingSenderId: "334384867537",
    appId: "1:334384867537:web:917ff6b7dbca8d64effdf0"
  }
  
  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);