import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

import { addLink, onLinksChange } from './firebase/app'
import Table from './components/Table';

function App() {

  const [inputUrl, setInputUrl] = useState("");
  const [inputUrlIsValid, setInputUrlIsValid]= useState(false);
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
    setPending(true);
    addLink({longUrl: inputUrl}).then(result => {
      setFeedback({
        success: true,
        url: result.data
      });
      setPending(false);
      setInputUrl("");
    });
  }

  const checkIfUrlIsValid = (string) => {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      setInputUrlIsValid(false);
      return;
    }
    setInputUrlIsValid(url.protocol === "http:" || url.protocol === "https:");
  }

  return (
    <div className="App">
      <main>
        <section className="glass">
          <h1>b-short-url</h1>
          <p className='info'>by julius bethge</p>
          <div className="add-link">
            <input value={inputUrl} onChange={(e) => {setInputUrl(e.target.value); checkIfUrlIsValid(e.target.value)}} type="text"/>
            <button disabled={pending || !inputUrlIsValid} onClick={handleCreateRequest}>Create</button>
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
          <Table headings={["clicks", "short url", "","destination", "last clicked"]}>
            {
              links ? links.sort((a,b) => b.visitCount-a.visitCount).map(link => (
                <tr key={link.shortUrl}>
                  <td><b>{link.visitCount}</b></td>
                  <td><a href={"https://www."+link.shortUrl}>{link.shortUrl}</a></td>
                  <td><img src={"https://s2.googleusercontent.com/s2/favicons?domain_url="+link.longUrl} /></td>
                  <td title={link.longUrl}>{link.longUrlString}</td>
                  <td><b>{link.lastVisited}</b></td>
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