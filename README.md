# Tori's Fahrplan

A personal learning site with six lines: AI engineering (LLMs, RAG, agents, computer vision, MLOps), engineering core (Python, Git, Docker, CI/CD, cloud, Terraform, Kubernetes), data platform engineering (Spark, Delta, dbt, Airflow, Kafka), security (detection engineering, AI security, cloud, web and DevSecOps), German (A2 revision, then B1), and career and craft (job market, roadmap, portfolio, debugging, system design, interviews).

Static site, no build step. Open `index.html` or deploy the folder as it is.

- `index.html` – page and styles
- `content.js` – helpers shared by all lesson files
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
