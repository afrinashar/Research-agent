# Multi-Agent Research Project

This project uses a lightweight multi-agent workflow to research a topic, assemble a structured report, and generate a PDF.

## Project idea
The app starts from a user topic such as "Electric Vehicles", then runs a research flow that:
1. collects web results,
2. summarizes the findings,
3. verifies facts from search snippets,
4. writes a polished report,
5. exports it as a PDF.

## Local setup

### 1. Create a virtual environment
```bash
python -m venv .venv
.venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment variables
Copy the example file and adjust values if needed:
```bash
copy .env.example .env
```

Example values:
```env
RESEARCH_TOPIC=Research Electric Vehicles
REPORT_OUTPUT_DIR=reports
SEARCH_MAX_RESULTS=5
```

### 4. Run locally
```bash
python main.py
```

The generated PDF will be saved in the output directory you configured.

## Production-ready options

### Docker
Build and run the container:
```bash
docker build -t multi-agent-research .
docker run --rm -v %cd%\reports:/app/reports multi-agent-research
```

### Production improvements to consider
- Replace the current demo-style search logic with a real retrieval layer and source validation.
- Add a proper API layer and authentication for external use.
- Use a managed queue and background workers for long-running jobs.
- Store generated reports in cloud storage such as Azure Blob Storage or S3.
- Add logging, monitoring, and health checks.

## Testing
```bash
python -m unittest discover -s tests -v
```

