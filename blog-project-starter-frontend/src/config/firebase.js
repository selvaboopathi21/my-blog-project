// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth}  from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyChyY9crDPnPFiyGrTwqT1TXBWiS0E3XeE",
  authDomain: "blog-project-starter.firebaseapp.com",
  projectId: "blog-project-starter",
  storageBucket: "blog-project-starter.firebasestorage.app",
  messagingSenderId: "334138354669",
  appId: "1:334138354669:web:b704db7dcdb190624f15e4",
  measurementId: "G-WYJKE4T0M8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)

export default auth