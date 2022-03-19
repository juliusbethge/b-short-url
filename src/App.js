import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import { addLink } from './firebase/app'

function App() {

  const [inputUrl, setInputUrl] = useState("");
  const [feedback, setFeedback] = useState();
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    setCopied(true)
    navigator.clipboard.writeText(feedback.url);
    setTimeout(() => {
      setCopied(false)
    }, 3000);
  }

  const handleCreateRequest = () => {
    // TODO: check url
    addLink({longUrl: inputUrl}).then(result => {
      setFeedback({
        success: true,
        url: result.data
      });
    });
  }

  return (
    <div className="App">
      <main>
        <section className="glass">
          <h1>b-short-url</h1>
          <p className='info'>by julius bethge</p>
          <div className="add-link">
            <input value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} type="text"/>
            <button onClick={handleCreateRequest}>Create</button>
          </div>
          {
            feedback && feedback.success ? (
            <div className="feedback">
              <span>Your short url is <a href={"https://www."+feedback.url}>{feedback.url}</a></span>
              <button disabled={copied} className="copy-to-clipboard" onClick={copyToClipboard}>{copied ? "Copied!" : "Copy"}</button>
            </div>
          ) : null
          }
        </section>
      </main>
    </div>
  );
}

export default App;