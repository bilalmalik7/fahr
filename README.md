# Tori's Fahrplan

A personal learning site built around one project. The **Project** line is the main path: twelve weeks, six sprints, building and securing HatchGuard, an AI assistant for a hatchery company, with company process (tickets, pull requests, ADRs, threat model, runbook). The code kit is in [`hatchguard/`](hatchguard/README.md). Six reference lines go deeper: AI engineering (LLMs, RAG, agents, computer vision, MLOps), engineering core (Python, Git, Docker, CI/CD, cloud, Terraform, Kubernetes), data platform engineering (Spark, Delta, dbt, Airflow, Kafka), security (detection engineering, AI security, cloud, web and DevSecOps), German (A2 revision, then B1), and career and craft (job market, roadmap, portfolio, debugging, system design, interviews).

Static site, no build step. Open `index.html` or deploy the folder as it is.

- `index.html` – page and styles
- `content.js` – helpers shared by all lesson files
- `c-build.js`, `c-build2.js` – Project line (main path)
- `hatchguard/` – the project kit: starter code, tests per milestone, reference solutions, process documents, Docker and CI
- `c-ai.js`, `c-ai2.js` – AI line
- `c-devops.js`, `c-eng.js` – engineering line
- `c-data.js`, `c-data2.js` – data line
- `c-deutsch0.js`, `c-deutsch1.js`, `c-deutsch2.js`, `c-vocab.js` – German line, flashcard decks, verbs
- `c-pro.js` – career line and glossary
- `c-sec.js`, `c-sec2.js` – security line, AI security track
- `widgets.js`, `widgets-de.js` – interactive parts
- `app.js` – routing, progress, exercises, spaced repetition, sound, tutor
- `weekly.js` – "This week in AI" items (replaced every week by a scheduled task)

Progress is stored in the browser (`localStorage`, key `fahrplan-v1`).
