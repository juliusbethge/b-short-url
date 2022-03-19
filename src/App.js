import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import FirebaseConfig from './firebase/firebase-config.json';

const app = initializeApp(FirebaseConfig);
const functions = getFunctions(app, 'europe-west1');
const addLink = httpsCallable(functions, 'addLink');

function App() {

  const [inputUrl, setInputUrl] = useState("");

  return (
    <div className="App">
      <main>
        <section className="glass">
          <h1>b-short-url</h1>
          <p className='info'>by julius bethge</p>
          <div className="add-link">
            <input value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} type="text"/>
            <button onClick={() => addLink({longUrl: inputUrl}).then(result => console.log(result))}>Create</button>
          </div>

        </section>
      </main>
    </div>
  );
}

export default App;