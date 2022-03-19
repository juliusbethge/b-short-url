import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import FirebaseConfig from './firebase-config.json';

const app = initializeApp(FirebaseConfig);
const functions = getFunctions(app, 'europe-west1');
const db = getFirestore(app);

export const addLink = httpsCallable(functions, 'addLink');

export const onLinksChange = (onChange) => {
    return onSnapshot(collection(db, 'links'), querySnapshot => {
        const docs = querySnapshot.docs.map(d => d.data());
        docs.forEach(doc => {
            doc.lastVisited = utcToRelativeString(doc.lastVisited.seconds);
            doc.longUrl = shortSring(doc.longUrl, 40);
        });
        onChange(docs);
    });
};

function utcToRelativeString (utc) {
    const utcNow = (new Date().getTime()) / 1000;
    const differenceInSeconds = utcNow - utc;
    if (differenceInSeconds > 86400) {
        return Math.floor(differenceInSeconds / 86400) + " day(s) ago";
    }
    else if (differenceInSeconds > 3600) {
        return Math.floor(differenceInSeconds / 3600) + " hour(s) ago";
    }
    else if (differenceInSeconds > 60) {
        return Math.floor(differenceInSeconds / 60) + " minute(s) ago";
    }
    else if (differenceInSeconds > 1) {
        return Math.floor(differenceInSeconds) + " second(s) ago";
    }
    return "now";
}

function shortSring (string, length) {
    if (string.length <= length) return string;
    return string.substring(0, length) + "...";
}