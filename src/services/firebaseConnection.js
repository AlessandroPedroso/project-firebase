import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

//import de autenticação do login
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB2MWtqHw3hf85d3tg2S53ZDEdDwPGVCRA",
  authDomain: "curso-e93e5.firebaseapp.com",
  projectId: "curso-e93e5",
  storageBucket: "curso-e93e5.firebasestorage.app",
  messagingSenderId: "13413844794",
  appId: "1:13413844794:web:4964f03e5fde6a95eff203",
  measurementId: "G-D7FPPM00LW"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)//autenticação

export { db,auth };
