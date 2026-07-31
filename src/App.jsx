import { useMemo, useState } from 'react';

const models = ['Llama 3.1', 'Mistral', 'Gemma'];
const initialStatuses = [
  { key: 'Research Agent', value: '⏸ Waiting' },
  { key: 'Summarizer Agent', value: '⏸ Waiting' },
  { key: 'Fact Checker', value: '⏸ Waiting' },
  { key: 'Report Writer', value: '⏸ Waiting' }
];

function App() {
  const [topic, setTopic] = useState('Electric Vehicles');
  const [model, setModel] = useState(models[0]);
  const [statuses, setStatuses] = useState(initialStatuses);
  const [logs, setLogs] = useState(['Ready to start research...']);
  const [preview, setPreview] = useState('Your report preview will appear here.');
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const themeClass = useMemo(() => (darkMode ? 'theme-dark' : 'theme-light'), [darkMode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setLogs(['Searching DuckDuckGo...', 'Reading webpages...', 'Extracting information...', 'Summarizing...', 'Checking facts...', 'Generating PDF...']);
    setStatuses([
      { key: 'Research Agent', value: '⏳ Running' },
      { key: 'Summarizer Agent', value: '⏸ Waiting' },
      { key: 'Fact Checker', value: '⏸ Waiting' },
      { key: 'Report Writer', value: '⏸ Waiting' }
    ]);
    setPreview('Generating report preview...');

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, model })
      });
      const data = await response.json();
      setStatuses(Object.entries(data.statuses).map(([key, value]) => ({ key, value })));
      setLogs(data.logs);
      setPreview(data.preview);
      setFilename(data.filename);
    } catch (error) {
      setLogs(['Failed to run research.', String(error)]);
      setPreview('Unable to generate the report preview.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`app-shell ${themeClass}`}>
      <aside className="sidebar">
        <div>
          <p className="eyebrow">CrewAI Research Studio</p>
          <h1>Multi-Agent Research Assistant</h1>
          <p className="subtitle">Turn any topic into a polished report with a collaborative research workflow.</p>
        </div>
        <div className="sidebar-card">
          <h3>Model Selection</h3>
          <div className="chip-row">
            {models.map((item) => (
              <button key={item} className={`chip ${model === item ? 'active' : ''}`} onClick={() => setModel(item)} type="button">
                {item}
              </button>
            ))}
          </div>
        </div>
        <button className="toggle" onClick={() => setDarkMode(!darkMode)} type="button">
          {darkMode ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
      </aside>

      <main className="content">
        <section className="hero-card">
          <form onSubmit={handleSubmit} className="hero-form">
            <div className="field-group">
              <label htmlFor="topic">Research Topic</label>
              <input id="topic" value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Electric Vehicles" />
            </div>
            <div className="field-group">
              <label htmlFor="modelSelect">Model</label>
              <select id="modelSelect" value={model} onChange={(event) => setModel(event.target.value)}>
                {models.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? 'Running...' : 'Start Research'}
            </button>
          </form>
        </section>

        <section className="grid">
          <div className="card">
            <div className="card-header">
              <h3>Agent Progress</h3>
              <span className="pill">Live</span>
            </div>
            <ul className="status-list">
              {statuses.map((item) => (
                <li key={item.key} className="status-row">
                  <span>{item.key}</span>
                  <span className={`status ${item.value.includes('Completed') ? 'success' : item.value.includes('Running') ? 'running' : ''}`}>{item.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Live Logs</h3>
              <span className="pill accent">Streaming</span>
            </div>
            <pre className="log-box">{logs.join('\n')}</pre>
          </div>
        </section>

        <section className="grid lower-grid">
          <div className="card">
            <div className="card-header">
              <h3>Report Preview</h3>
              <span className="pill">Preview</span>
            </div>
            <pre className="preview-box">{preview}</pre>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Download</h3>
              <span className="pill accent">PDF</span>
            </div>
            {filename ? (
              <>
                <a className="download-link" href={`/reports/${filename}`} target="_blank" rel="noreferrer">Download PDF</a>
                <p className="download-caption">Saved as: {filename}</p>
              </>
            ) : (
              <p className="download-caption">Your report will appear here after the workflow completes.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
