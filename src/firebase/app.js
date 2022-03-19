import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import FirebaseConfig from './firebase-config.json';

const app = initializeApp(FirebaseConfig);
const functions = getFunctions(app, 'europe-west1');

export const addLink = httpsCallable(functions, 'addLink');