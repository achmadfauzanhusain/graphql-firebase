import config from "../config/index.js";

import { initializeApp } from "firebase/app"
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: config.APIKEY,
  authDomain: config.AUTHDOMAIN,
  databaseURL: config.DATABASEURL,
  projectId: config.PROJECTID,
  storageBucket: config.STORAGEBUCKET,
  messagingSenderId: config.MESSAGINGSENDERID,
  appId: config.APPID,
  measurementId: config.MEASUREMENTID
}

initializeApp(firebaseConfig);
const db = getFirestore();
const colHobby = collection(db, "hobbies");

export { db, colHobby }