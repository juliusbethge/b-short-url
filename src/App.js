import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import { addLink } from './firebase/app'

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