import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

import { addLink, onLinksChange } from './firebase/app'
import Table from './components/Table';

function App() {

  const [inputUrl, setInputUrl] = useState("");
  const [feedback, setFeedback] = useState();
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState(false);

  const [links, setLinks] = useState([]);

  useEffect(() => {
    onLinksChange((docs) => {
      setLinks(docs);
    });
  }, []);
  
  const copyToClipboard = () => {
    setCopied(true)
    navigator.clipboard.writeText(feedback.url);
    setTimeout(() => {
      setCopied(false)
    }, 3000);
  }

  const handleCreateRequest = () => {
    // TODO: check url
    setPending(true);
    addLink({longUrl: inputUrl}).then(result => {
      setFeedback({
        success: true,
        url: result.data
      });
      setPending(false);
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
            <button disabled={pending} onClick={handleCreateRequest}>Create</button>
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

        <section className="glass">
          <Table headings={["clicks", "short url", "destination", "last click"]}>
            {
              links ? links.map(link => (
                <tr>
                  <td>{link.visitCount}</td>
                  <td>{link.shortUrl}</td>
                  <td>{link.longUrl}</td>
                  <td>{link.lastVisited}</td>
                </tr>
              )) : null
            }
          </Table>
        </section>
      </main>
    </div>
  );
}

export default App;